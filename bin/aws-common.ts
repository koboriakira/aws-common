#!/usr/bin/env node
/** @format */

import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { KoboriAkiraStack } from "../lib/koboriakira-stack";

const app = new cdk.App();
new KoboriAkiraStack(app, "KoboriAkiraStack", {});
