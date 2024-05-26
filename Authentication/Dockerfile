# Temel image olarak resmi bir Node.js image kullanın
FROM node:14-slim

# Çalışma dizinini belirleyin
WORKDIR /opt/node-server

# package.json ve package-lock.json dosyalarını kopyalayın
COPY package*.json ./

# Bağımlılıkları yükleyin
RUN npm install

# Uygulama dosyalarını kopyalayın
COPY src/ .

# Uygulamanızı başlatın
CMD ["node", "index.js"]
