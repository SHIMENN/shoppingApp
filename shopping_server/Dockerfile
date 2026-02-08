# משתמשים בגרסה 20 כדי לפתור את בעיית ה-crypto
FROM node:20-alpine

WORKDIR /usr/src/app

# העתקת קבצי הגדרות
COPY package*.json ./

# התקנת תלויות
RUN npm install

# העתקת כל שאר הקוד
COPY . .

# בנייה של פרויקט NestJS
RUN npm run build

# חשיפת הפורט של השרת (לרוב 3000)
EXPOSE 3000

# הרצה
CMD ["npm", "run", "start:prod"]