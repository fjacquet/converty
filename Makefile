.PHONY: all help install dev build start lint type-check test clean

# Default target
all: install lint type-check build

help:
	@echo "Converty - Web Calculator & Converter Collection"
	@echo ""
	@echo "Usage:"
	@echo "  make install      Install dependencies"
	@echo "  make dev          Start development server"
	@echo "  make build        Build for production"
	@echo "  make start        Start production server"
	@echo "  make lint         Run ESLint"
	@echo "  make type-check   Run TypeScript type checking"
	@echo "  make test         Run tests"
	@echo "  make clean        Remove build artifacts"
	@echo ""

# Install dependencies
install:
	npm install

# Start development server
dev:
	npm run dev

# Build for production
build:
	npm run build

# Start production server
start:
	npm run start

# Run linter
lint:
	npm run lint

# Run TypeScript type checking
type-check:
	npx tsc --noEmit

# Run tests
test:
	npm test

# Clean build artifacts
clean:
	rm -rf .next
	rm -rf out
	rm -rf node_modules/.cache
	rm -rf coverage
	@echo "Cleaned build artifacts"

# Full rebuild
rebuild: clean install build
