package provisioning

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"

	// s3Types "github.com/aws/aws-sdk-go-v2/service/s3/types"
	"github.com/aws/aws-sdk-go-v2/service/cloudfront"
	cfTypes "github.com/aws/aws-sdk-go-v2/service/cloudfront/types"
	"github.com/aws/aws-sdk-go-v2/service/route53"
	route53Types "github.com/aws/aws-sdk-go-v2/service/route53/types"
)

func CreateS3(ctx context.Context, s3Client *s3.Client, bucketName string) error{
	// s3Client := s3.NewFromConfig(cfg)
	_, err := s3Client.CreateBucket(ctx, &s3.CreateBucketInput{
		Bucket: aws.String(bucketName),
	})
	if err != nil {
		// panic("failed to create bucket, " + err.Error())
		return err
	}
	fmt.Println("bucket created")
	return nil
}

// --------------------------------------------------------------

func CreateOriginAccessControl(ctx context.Context, cfClient cloudfront.Client, bucketName string) (*cfTypes.OriginAccessControl, error) {
	// cfClient := cloudfront.NewFromConfig(cfg)
	oacOutput, err := cfClient.CreateOriginAccessControl(ctx, &cloudfront.CreateOriginAccessControlInput{
		OriginAccessControlConfig: &cfTypes.OriginAccessControlConfig{
			OriginAccessControlOriginType: cfTypes.OriginAccessControlOriginTypesS3,
			Name: aws.String("OAC for " + bucketName),
			SigningBehavior: cfTypes.OriginAccessControlSigningBehaviorsAlways,
			SigningProtocol: cfTypes.OriginAccessControlSigningProtocolsSigv4,
		},
	})
	if err != nil {
		// log.Fatalf("failed to create origin access control: %v", err)
		return nil, err
	}
	fmt.Println("origin access control created: " + *oacOutput.OriginAccessControl.Id)
	return oacOutput.OriginAccessControl, nil
}

// --------------------------------------------------------------

func CreateCloudFrontDistribution(ctx context.Context, cfClient *cloudfront.Client, bucketName string, certificateArn string, oacId *string, callerReference string) (*cloudfront.CreateDistributionOutput, error) {
	// cfClient := cloudfront.NewFromConfig(cfg)
	cfCreateOutput, err := cfClient.CreateDistribution(ctx, &cloudfront.CreateDistributionInput{
		
		DistributionConfig: &cfTypes.DistributionConfig{
			DefaultRootObject: aws.String("index.html"),
			Aliases: &cfTypes.Aliases{
				Quantity: aws.Int32(1),
				Items: []string{bucketName},
			},
			Comment: aws.String("distribution for " + bucketName),
			DefaultCacheBehavior: &cfTypes.DefaultCacheBehavior{
				TargetOriginId: aws.String("S3-" + bucketName),
				ViewerProtocolPolicy: cfTypes.ViewerProtocolPolicyRedirectToHttps,
				MinTTL: aws.Int64(0),
				ForwardedValues: &cfTypes.ForwardedValues{
					QueryString: aws.Bool(true),
					Cookies: &cfTypes.CookiePreference{
						Forward: cfTypes.ItemSelectionAll,
					},
				},
			},
			CallerReference: aws.String(callerReference),
			Enabled:         aws.Bool(true),
			ViewerCertificate: &cfTypes.ViewerCertificate{
				ACMCertificateArn: aws.String(certificateArn),
				SSLSupportMethod: cfTypes.SSLSupportMethodSniOnly,
				MinimumProtocolVersion: cfTypes.MinimumProtocolVersionTLSv122021,
			},
			Origins: &cfTypes.Origins{
				Items: []cfTypes.Origin{
						{
								Id:     aws.String("S3-" + bucketName),
								DomainName: aws.String(bucketName + ".s3.amazonaws.com"),
								OriginAccessControlId: oacId,
								S3OriginConfig: &cfTypes.S3OriginConfig{
										OriginAccessIdentity: aws.String(""),
								},
						},
				},
				Quantity: aws.Int32(1),
		},
		},
	})
	if err != nil {
		// panic("failed to create distribution, " + err.Error())
		return nil, err
	}
	return cfCreateOutput, nil
}

// --------------------------------------------------------------

func CreateAndUpdateBucketPolicy(ctx context.Context, s3Client *s3.Client, bucketName string, distributionId *string) error {
		// policy for origin access control
		bucketPolicy := map[string]interface{}{
			"Version": "2008-10-17",
			"Id": "PolicyForCloudFrontPrivateContent",
			"Statement": []map[string]interface{}{
					{
							"Sid": "AllowCloudFrontServicePrincipal",
							"Effect": "Allow",
							"Principal": map[string]string{
									"Service": "cloudfront.amazonaws.com",
							},
							"Action": "s3:GetObject",
							"Resource": "arn:aws:s3:::" + bucketName + "/*",
							"Condition": map[string]map[string]string{
									"StringEquals": {
											"AWS:SourceArn": "arn:aws:cloudfront::093095953258:distribution/" + *distributionId,
									},
							},
					},
				},
	}

	bucketPolicyJson, err := json.Marshal(bucketPolicy)
	if err != nil {
		return err
	}
	// Update the S3 bucket policy
	_, err = s3Client.PutBucketPolicy(ctx, &s3.PutBucketPolicyInput{
		Bucket: aws.String(bucketName),
		Policy: aws.String(string(bucketPolicyJson)),
	})
	if err != nil {
		return err
	}
	return nil
}

// --------------------------------------------------------------

func GetDistributionDomainName(ctx context.Context, cfClient *cloudfront.Client, distributionId *string) (string, error) {
	output, err := cfClient.GetDistribution(context.TODO(), &cloudfront.GetDistributionInput{
		// Id: aws.String(tempDistId),
		Id: aws.String(*distributionId),
	})
	if err != nil {
		return "", err
	}
	return *output.Distribution.DomainName, nil
}

// --------------------------------------------------------------

func CreateRoute53AliasRecord(ctx context.Context, route53Client *route53.Client, bucketName string, distributionDomainName *string, hostedZoneId string) error {
	// route53Client := route53.NewFromConfig(cfg)
	_, err := route53Client.ChangeResourceRecordSets(ctx, &route53.ChangeResourceRecordSetsInput{
		ChangeBatch: &route53Types.ChangeBatch{
			Changes: []route53Types.Change{
				{
					Action: route53Types.ChangeActionCreate,
					ResourceRecordSet: &route53Types.ResourceRecordSet{
						Name: aws.String(bucketName),
						Type: route53Types.RRTypeA,
						AliasTarget: &route53Types.AliasTarget{
							DNSName:              distributionDomainName,
							EvaluateTargetHealth: false,
							// cloudfront hosted zone id
							HostedZoneId:         aws.String("Z2FDTNDATAQYW2"),
						},
					},
				},
			},
			Comment: aws.String("my test record"),
		},
		HostedZoneId: aws.String(hostedZoneId),
	})
	if err != nil {
		return err
	}
	return nil
}