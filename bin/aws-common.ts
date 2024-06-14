#!/usr/bin/env node
/** @format */

import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { KoboriAkiraStack } from "../lib/koboriakira-stack";
import { SnsStack } from '../lib/sns-stack';


const app = new cdk.App();
new KoboriAkiraStack(app, "KoboriAkiraStack", {});
new SnsStack(app, 'SnsStack', {});
