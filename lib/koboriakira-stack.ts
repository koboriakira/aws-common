/** @format */

import {
  Stack,
  StackProps,
  Duration,
  RemovalPolicy,
  aws_s3 as s3,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as origins,
  aws_iam as iam,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class KoboriAkiraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // S3バケットを作成
    const bucket = new s3.Bucket(this, "Bucket", {
      bucketName: process.env.COMMON_BUCKET_NAME, // koboriakira-bucket
      removalPolicy: RemovalPolicy.RETAIN,
    });

    // IAMユーザの作成
    const bucketMaintainer = new iam.User(this, "BucketMaintainer", {
      userName: "koboriakira-bucket-maintainer",
    });

    // バケットに対するアクセス権限を付与
    const bucketPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["s3:*"],
      resources: [bucket.bucketArn, `${bucket.bucketArn}/*`],
    });

    // ユーザにポリシーをアタッチ
    bucketMaintainer.addToPolicy(bucketPolicy);

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
