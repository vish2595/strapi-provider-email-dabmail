'use strict';

/**
 * Module dependencies
 */

const _ = require('lodash');
const nodemailer = require('nodemailer');
const aws = require("@aws-sdk/client-ses");
// let { defaultProvider } = require("@aws-sdk/credential-provider-node");

const emailFields = [
  'from',
  'replyTo',
  'to',
  'cc',
  'bcc',
  'subject',
  'text',
  'html',
  'attachments',
  'icalEvent',
];

module.exports = {
  init(providerOptions = {}, settings = {}) {
    const ses = new aws.SES({
      apiVersion: "2010-12-01",
      region: "us-east-1",
      ...providerOptions
    });
    const transporter = nodemailer.createTransport({
      SES: { ses, aws },
    });

    return {
      send(options) {
        // Default values.
        const emailOptions = {
          ..._.pick(options, emailFields),
          from: options.from || settings.defaultFrom,
          replyTo: options.replyTo || settings.defaultReplyTo,
          text: options.text || options.html,
          html: options.html || options.text,
        };

        return transporter.sendMail(emailOptions);
      },
    };
  },
};
