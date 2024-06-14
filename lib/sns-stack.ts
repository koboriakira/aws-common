import {
  Stack,
  StackProps,
  aws_iam as iam,
  aws_sns as sns,
  aws_chatbot as chatbot,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class MySnsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const slackWorkspaceId = String(process.env.SLACK_KOBORI_WORKSPACE_ID);
    const slackChannelId = String(process.env.SLACK_KOBORI_NOTICE_CHANNEL_ID);

    // SNSトピックの作成
    const fatalTopic = new sns.Topic(this, 'FatalTopic', {
      displayName: 'Topic for fatal errors',
      topicName: 'FatalTopic',
    });

    // Chatbot用のIAMロール・ポリシー
    const chatbotRole = new iam.Role(this, "ChatbotRole", {
      roleName: "chatbot-role",
      assumedBy: new iam.ServicePrincipal("chatbot.amazonaws.com"),
    });
    chatbotRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLogsReadOnlyAccess')
    );
    chatbotRole.addToPolicy(
      new iam.PolicyStatement({
        resources: ["*"],
        actions: [
          "cloudwatch:Describe*",
          "cloudwatch:Get*",
          "cloudwatch:List*",
        ],
      })
    );

    // Chatbot設定
    const fatalChatbot = new chatbot.SlackChannelConfiguration(this, `SlackChannelConfiguration`, {
      slackChannelConfigurationName: `SlackChannelConfiguration`,
      slackWorkspaceId: slackWorkspaceId,
      slackChannelId: slackChannelId,
      notificationTopics: [fatalTopic],
      loggingLevel: chatbot.LoggingLevel.INFO,
      role: chatbotRole,
    });
  }
}
