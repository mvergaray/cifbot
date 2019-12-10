let auth = require('./auth');

let clients = require('./clients');
let providers = require('./providers');
let receipts = require('./receipts');
let transactions = require('./transactions');
let webhookRoutes = require('./webhook');

const passport = require('passport');

module.exports = function (app) {
    app.use('/auth', auth);
    app.use('/receipts', passport.authenticate('jwt', {session: false}), receipts);
    app.use('/clients', passport.authenticate('jwt', {session: false}), clients);
    app.use('/providers', passport.authenticate('jwt', {session: false}), providers);
    app.use('/transactions', passport.authenticate('jwt', {session: false}), transactions);
    app.use('/webhook', webhookRoutes);
};
