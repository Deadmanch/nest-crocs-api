FROM node:20-alpine

# Устанавливаем pnpm глобально
RUN npm install -g pnpm

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы package.json и pnpm-lock.yaml
COPY ./package*.json ./
COPY ./pnpm-lock.yaml ./

# Устанавливаем зависимости
RUN pnpm install

# Копируем остальные файлы
COPY . .

# Собираем проект
RUN pnpm run build

# Удаляем дев-зависимости
RUN pnpm prune --prod

# Указываем команду для запуска приложения
CMD ["node", "./dist/main.js"]