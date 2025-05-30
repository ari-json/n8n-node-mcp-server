# Contributing to N8N Node MCP Server

Thank you for your interest in contributing to the N8N Node MCP Server! We welcome contributions from the community and are grateful for any help you can provide.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Reporting Issues](#reporting-issues)
- [Suggesting Features](#suggesting-features)
- [Submitting Pull Requests](#submitting-pull-requests)
- [Development Setup](#development-setup)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

## How to Contribute

There are many ways to contribute to this project:

- **Report bugs** and issues
- **Suggest new features** or improvements
- **Submit pull requests** to fix bugs or add features
- **Improve documentation**
- **Write tests**
- **Help others** in discussions

## Reporting Issues

Before creating an issue, please:

1. **Search existing issues** to avoid duplicates
2. **Verify the issue** is reproducible
3. **Gather information** about your environment

When creating an issue, include:

- **Clear title** describing the problem
- **Detailed description** of the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **Environment details**:
  - Python version
  - Operating system
  - Claude Desktop version
  - Relevant error messages or logs

### Issue Template

```markdown
## Description
Brief description of the issue

## Steps to Reproduce
1. Step one
2. Step two
3. ...

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Python version: 
- OS: 
- Claude Desktop version: 

## Additional Context
Any other relevant information
```

## Suggesting Features

We love feature suggestions! When proposing a new feature:

1. **Check existing issues** and pull requests
2. **Explain the use case** - why is this feature needed?
3. **Describe the solution** you'd like to see
4. **Consider alternatives** you've thought about
5. **Provide examples** of how it would work

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature

## Use Case
Why is this feature needed? What problem does it solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
What other solutions have you considered?

## Additional Context
Any examples, mockups, or references
```

## Submitting Pull Requests

### Before You Start

1. **Fork the repository** and clone it locally
2. **Create a new branch** for your feature/fix
3. **Set up the development environment**
4. **Make your changes** following our guidelines
5. **Test your changes** thoroughly
6. **Submit the pull request**

### Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Ensure all tests pass**
4. **Update the CHANGELOG.md** if applicable
5. **Request review** from maintainers

### Pull Request Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Other (please describe)

## Testing
- [ ] Tests pass locally
- [ ] New tests added (if applicable)
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

## Development Setup

### Prerequisites

- Python 3.9+
- pip
- git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/ari-json/n8n-node-mcp-server.git
cd n8n-node-mcp-server

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install in development mode
pip install -e .
```

### Running Tests

```bash
# Run all tests
python -m pytest

# Run with coverage
python -m pytest --cov=.

# Run specific test file
python -m pytest tests/test_server.py
```

## Code Style Guidelines

### Python Style

We follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) with these specifics:

- **Line length**: 100 characters maximum
- **Indentation**: 4 spaces (no tabs)
- **Imports**: Grouped and sorted
  ```python
  # Standard library
  import os
  import sys
  
  # Third-party
  import httpx
  from mcp.server.fastmcp import FastMCP
  
  # Local
  from .utils import helper_function
  ```

### Code Formatting

We recommend using:
- **black** for automatic formatting
- **isort** for import sorting
- **flake8** for linting

```bash
# Format code
black server.py

# Sort imports
isort server.py

# Check linting
flake8 server.py
```

### Docstrings

Use Google-style docstrings:

```python
def function_name(param1: str, param2: int) -> dict:
    """Brief description of function.
    
    More detailed description if needed.
    
    Args:
        param1: Description of param1
        param2: Description of param2
        
    Returns:
        Description of return value
        
    Raises:
        ValueError: When invalid input provided
    """
```

### Type Hints

Use type hints for function parameters and returns:

```python
from typing import List, Dict, Optional

def process_nodes(node_names: List[str]) -> Dict[str, Any]:
    """Process node information."""
    pass
```

## Testing

### Writing Tests

- Place tests in the `tests/` directory
- Name test files with `test_` prefix
- Use descriptive test names
- Test edge cases and error conditions

Example test:

```python
import pytest
from server import search_nodes

@pytest.mark.asyncio
async def test_search_nodes_found():
    """Test searching for nodes with results."""
    result = await search_nodes("HTTP")
    assert "HTTP" in result
    assert "Found" in result

@pytest.mark.asyncio
async def test_search_nodes_not_found():
    """Test searching for non-existent nodes."""
    result = await search_nodes("NonExistentNode123")
    assert "No nodes found" in result
```

## Documentation

### Code Documentation

- Add docstrings to all public functions and classes
- Include type hints
- Provide usage examples in docstrings
- Keep comments concise and relevant

### README Updates

When adding features:
- Update the Features section
- Add usage examples
- Update configuration if needed
- Add troubleshooting tips if relevant

### API Documentation

Document new MCP tools with:
- Tool name and description
- Parameters with types
- Return value description
- Usage example

## Getting Help

If you need help:

1. Check the [README](README.md) and documentation
2. Search [existing issues](https://github.com/ari-json/n8n-node-mcp-server/issues)
3. Ask in [discussions](https://github.com/ari-json/n8n-node-mcp-server/discussions)
4. Create an issue if needed

## Recognition

Contributors will be recognized in:
- The project README
- Release notes
- Special thanks section

Thank you for contributing to N8N Node MCP Server! 🎉 