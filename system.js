module.exports = {
  apps: [
    {
      name: 'assistance',
      script: '/var/www/assistance/dist/app.js',
      time: true,
      log_type: 'json',
      output: '/var/www/assistance/logs/out.log',
      error: '/var/www/assistance/logs/error.log',
      log: '/var/www/assistance/logs/combined.log',
      log_date_format: 'DD-MM-YYYY hh:mm',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
