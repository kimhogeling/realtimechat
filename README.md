# realtimechat

Created with NodeJS, Express, socket.io and redis.

## How to get it running on UNIX (OSX, Linux)

### 1 - Node / NPM

This project depends on Node and its package manager NPM (Node Package Manager).
If you already have those installed, skip to step 2.

You can install Node and NPM using another program called NVM (Node Version Manager).
Let's install NVM first:

```sh
curl https://raw.githubusercontent.com/creationix/nvm/v0.23.3/install.sh | bash
```

Now, let's install a recent Node version:
```sh
nvm install v0.12.0
```

You can now test if Node and NPM are correctly installed by running:
```sh
npm -v
node -v
```

If you see version numbers like `2.5.1` and `v0.12.0`, it means you're good to go!

Awesome! Just a few more steps.

### 2 - Download the chat

Let's download the realtime chat:
```sh
git clone https://github.com/kimhogeling/realtimechat.git && cd realtimechat
```

### 3 - Install chat dependencies

And now, let's install it's dependencies:

```sh
bower install
npm install
```

### 4 - Installing Redis (in memory cache)

Finally, we'll need to install Redis, an in memory cache.

If you're on OSX, you can install it using [Brew](http://brew.sh):
```sh
brew install redis
```

If you're on a Debian based Linux (Ubuntu, Elementary, ...), you can do:
```sh
sudo apt-get install redis
```

### 5 - Launching and using the chat

Yuhuuu! We're done. Now, let's start the chat:
```sh
node app.js
```

In your favorite web browser, visit `localhost:8080`.
