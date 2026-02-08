FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# חשיפת הפורט של הלקוח (ב-Vite זה לרוב 5173, ב-React רגיל 3000)
EXPOSE 5173

# הרצה במצב פיתוח כדי שתוכל לראות שינויים
CMD ["npm", "run", "dev", "--", "--host"]