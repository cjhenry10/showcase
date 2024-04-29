package main

import (
	"context"
	"net/http"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/cjhenry10/showcase/api/provisioning"
)

func main() {
	http.HandleFunc("/", provisionInfrastructure)

	http.ListenAndServe(":8080", nil)
}

func provisionInfrastructure(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	cfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		panic("configuration error, " + err.Error())
	}

	// call the functions from the provisioning package with bucket name from the request

	s3Client := s3.NewFromConfig(cfg)

	provisioning.CreateS3(ctx, s3Client, "my-bucket")
}