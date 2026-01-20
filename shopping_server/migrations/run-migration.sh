#!/bin/bash

# Database Migration Runner
# This script runs the column renaming migration

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}======================================${NC}"
echo -e "${YELLOW}Database Migration: Rename Columns${NC}"
echo -e "${YELLOW}======================================${NC}"
echo ""

# Load environment variables
if [ -f ../.env ]; then
    export $(cat ../.env | grep -v '^#' | xargs)
    echo -e "${GREEN}✓ Environment variables loaded${NC}"
else
    echo -e "${RED}✗ .env file not found${NC}"
    echo "Please create a .env file with database credentials"
    exit 1
fi

# Check if database credentials exist
if [ -z "$DB_HOST" ] || [ -z "$DB_PORT" ] || [ -z "$DB_USERNAME" ] || [ -z "$DB_PASSWORD" ] || [ -z "$DB_DATABASE" ]; then
    echo -e "${RED}✗ Missing database credentials in .env file${NC}"
    echo "Required variables: DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE"
    exit 1
fi

echo ""
echo "Database: $DB_DATABASE"
echo "Host: $DB_HOST:$DB_PORT"
echo "User: $DB_USERNAME"
echo ""

# Backup prompt
echo -e "${YELLOW}⚠ Warning: This migration will rename database columns${NC}"
echo -e "${YELLOW}⚠ It's recommended to backup your database first${NC}"
echo ""
read -p "Have you backed up your database? (yes/no): " backup_confirm

if [ "$backup_confirm" != "yes" ]; then
    echo -e "${RED}Migration cancelled. Please backup your database first.${NC}"
    echo ""
    echo "To backup your database, run:"
    echo "  pg_dump -U $DB_USERNAME -h $DB_HOST -p $DB_PORT $DB_DATABASE > backup_\$(date +%Y%m%d_%H%M%S).sql"
    exit 1
fi

echo ""
read -p "Are you sure you want to run the migration? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo -e "${RED}Migration cancelled.${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Running migration...${NC}"

# Set PGPASSWORD environment variable
export PGPASSWORD=$DB_PASSWORD

# Run the migration
psql -U $DB_USERNAME -h $DB_HOST -p $DB_PORT -d $DB_DATABASE -f rename_columns_to_snake_case.sql

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}======================================${NC}"
    echo -e "${GREEN}✓ Migration completed successfully!${NC}"
    echo -e "${GREEN}======================================${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Restart your NestJS server"
    echo "2. Verify that the application works correctly"
    echo "3. Check the database schema to confirm column names"
else
    echo ""
    echo -e "${RED}======================================${NC}"
    echo -e "${RED}✗ Migration failed!${NC}"
    echo -e "${RED}======================================${NC}"
    echo ""
    echo "Please check the error messages above and:"
    echo "1. Verify your database credentials"
    echo "2. Check that the database is accessible"
    echo "3. Review the migration SQL file"
    exit 1
fi

# Unset password
unset PGPASSWORD
