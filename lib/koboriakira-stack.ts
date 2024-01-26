/** @format */

import {
  Stack,
  StackProps,
  Duration,
  RemovalPolicy,
  aws_s3 as s3,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as origins,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class KoboriAkiraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // S3バケットを作成
    const bucket = new s3.Bucket(this, "Bucket", {
      bucketName: "koboriakira-bucket",
      removalPolicy: RemovalPolicy.RETAIN,
    });

    // カスタムキャッシュポリシーの作成
    const myCachePolicy = new cloudfront.CachePolicy(this, "CachePolicy", {
      cachePolicyName: "koboriakira-cache-policy",
      defaultTtl: Duration.days(365),
      minTtl: Duration.days(365),
      maxTtl: Duration.days(365),
      cookieBehavior: cloudfront.CacheCookieBehavior.none(), // クッキーをキャッシュキーに含めない
      headerBehavior: cloudfront.CacheHeaderBehavior.none(), // ヘッダーをキャッシュキーに含めない
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.none(), // クエリストリングをキャッシュキーに含めない
    });

    // CloudFrontディストリビューションの作成
    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: new origins.S3Origin(bucket),
        cachePolicy: myCachePolicy,
      },
    });
  }
}
