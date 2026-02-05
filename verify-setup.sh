#!/bin/bash

echo "==================================="
echo "Claims Smart Apps - Setup Verification"
echo "==================================="
echo ""

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✓ Node.js installed: $NODE_VERSION"
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ $MAJOR_VERSION -lt 18 ]; then
        echo "⚠ Warning: Node.js 18 or higher is recommended"
    fi
else
    echo "✗ Node.js not found. Please install Node.js 18 or higher"
    exit 1
fi

# Check npm version
echo "Checking npm version..."
NPM_VERSION=$(npm -v 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✓ npm installed: $NPM_VERSION"
else
    echo "✗ npm not found"
    exit 1
fi

echo ""
echo "Checking directory structure..."

# Check for required directories
REQUIRED_DIRS=(
    "packages/vendor-management/src"
    "packages/time-expense/src"
    "packages/shared/src"
    "packages/mock-api/src"
    "docs"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "✓ $dir exists"
    else
        echo "✗ $dir missing"
    fi
done

echo ""
echo "Checking key configuration files..."

# Check for required files
REQUIRED_FILES=(
    "package.json"
    "tsconfig.json"
    ".eslintrc.json"
    ".prettierrc.json"
    "packages/vendor-management/package.json"
    "packages/time-expense/package.json"
    "packages/shared/package.json"
    "packages/mock-api/package.json"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file exists"
    else
        echo "✗ $file missing"
    fi
done

echo ""
echo "==================================="
echo "Setup verification complete!"
echo ""
echo "Next steps:"
echo "1. Run 'npm install' to install dependencies"
echo "2. Run 'npm run dev' to start all services"
echo "3. Visit http://localhost:5173 for Vendor Management"
echo "4. Visit http://localhost:5174 for Time & Expense"
echo "==================================="
