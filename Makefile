.PHONY: help install dev-install test clean run lint format setup

# Default target
help:
	@echo "N8N Node MCP Server - Development Commands"
	@echo "========================================="
	@echo ""
	@echo "Available commands:"
	@echo "  make install      - Install production dependencies"
	@echo "  make dev-install  - Install development dependencies"
	@echo "  make test         - Run test suite"
	@echo "  make clean        - Clean up cache and build files"
	@echo "  make run          - Run the MCP server"
	@echo "  make lint         - Run code linting"
	@echo "  make format       - Format code with black"
	@echo "  make setup        - Complete development setup"
	@echo ""

# Install production dependencies
install:
	@echo "Installing production dependencies..."
	pip install -r requirements.txt

# Install development dependencies
dev-install: install
	@echo "Installing development dependencies..."
	pip install pytest pytest-asyncio pytest-cov
	pip install black isort flake8
	pip install --upgrade pip

# Run tests
test:
	@echo "Running tests..."
	python examples/test_connection.py
	@if [ -d "tests" ]; then \
		python -m pytest tests/ -v; \
	fi

# Clean up
clean:
	@echo "Cleaning up..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name ".coverage" -delete
	rm -rf .pytest_cache/
	rm -rf htmlcov/
	rm -rf dist/
	rm -rf build/
	rm -rf *.egg-info

# Run the server
run:
	@echo "Starting N8N Node MCP Server..."
	python server.py

# Lint code
lint:
	@echo "Running flake8..."
	@if command -v flake8 >/dev/null 2>&1; then \
		flake8 server.py --max-line-length=100 --statistics; \
	else \
		echo "flake8 not installed. Run 'make dev-install' first."; \
	fi

# Format code
format:
	@echo "Formatting code with black and isort..."
	@if command -v black >/dev/null 2>&1; then \
		black server.py examples/; \
		isort server.py examples/; \
	else \
		echo "black/isort not installed. Run 'make dev-install' first."; \
	fi

# Complete setup
setup: clean dev-install
	@echo "Development environment setup complete!"
	@echo ""
	@echo "Next steps:"
	@echo "1. Configure Claude Desktop (see README.md)"
	@echo "2. Run 'make test' to verify installation"
	@echo "3. Run 'make run' to start the server" 