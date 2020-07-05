Requirements:

npm install -g forever

sudo forever stopall
cd ~/cifbot/cifbot-be
sudo forever -o log/out.log -e log/err.log start -c "node --stack_size=4096 --max-old-space-size=4096" app.js