var amqp = require('amqplib/callback_api');
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ApplicationLetter = require('../fileModeration/models/ApplicationLetter');
const rabbitmq = require('rabbitmq');