#!/usr/bin/env python3
"""
Test runner script for The Pickle Pot API tests.

This script provides convenient commands to run different types of tests:
- Unit tests: Fast, isolated tests for individual components
- Integration tests: Tests for API endpoints and database interactions  
- E2E tests: Complete user scenarios and workflows
- Performance tests: Load and stress testing

Usage:
    python run_tests.py --unit                 # Run only unit tests
    python run_tests.py --integration          # Run only integration tests  
    python run_tests.py --e2e                  # Run only end-to-end tests
    python run_tests.py --all                  # Run all tests
    python run_tests.py --coverage             # Run with coverage report
    python run_tests.py --slow                 # Include slow running tests
"""

import sys
import subprocess
import argparse
from pathlib import Path

def run_command(cmd):
    """Run a shell command and return the result."""
    print(f"Running: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.stdout:
        print(result.stdout)
    if result.stderr:
        print(result.stderr, file=sys.stderr)
    
    return result.returncode

def main():
    parser = argparse.ArgumentParser(description="Run API tests for The Pickle Pot")
    
    # Test type options
    parser.add_argument("--unit", action="store_true", help="Run unit tests only")
    parser.add_argument("--integration", action="store_true", help="Run integration tests only") 
    parser.add_argument("--e2e", action="store_true", help="Run end-to-end tests only")
    parser.add_argument("--all", action="store_true", help="Run all tests")
    
    # Additional options
    parser.add_argument("--coverage", action="store_true", help="Run with coverage report")
    parser.add_argument("--slow", action="store_true", help="Include slow running tests")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    parser.add_argument("--parallel", "-n", type=int, help="Run tests in parallel (number of workers)")
    
    args = parser.parse_args()
    
    # Base pytest command
    cmd = ["python", "-m", "pytest"]
    
    # Add verbose flag
    if args.verbose:
        cmd.append("-v")
    
    # Add parallel execution
    if args.parallel:
        cmd.extend(["-n", str(args.parallel)])
    
    # Add coverage
    if args.coverage:
        cmd.extend([
            "--cov=models",
            "--cov=schemas", 
            "--cov=routers",
            "--cov=core",
            "--cov-report=html",
            "--cov-report=term-missing"
        ])
    
    # Add test markers based on arguments
    if args.unit:
        cmd.extend(["-m", "unit"])
    elif args.integration:
        cmd.extend(["-m", "integration"])
    elif args.e2e:
        cmd.extend(["-m", "e2e"])
    elif args.all:
        pass  # Run all tests
    else:
        # Default: run unit and integration tests
        cmd.extend(["-m", "unit or integration"])
    
    # Include slow tests if requested
    if not args.slow:
        if "-m" in cmd:
            marker_index = cmd.index("-m") + 1
            cmd[marker_index] = f"{cmd[marker_index]} and not slow"
        else:
            cmd.extend(["-m", "not slow"])
    
    # Run the tests
    return_code = run_command(cmd)
    
    if return_code == 0:
        print("\n✅ All tests passed!")
        
        if args.coverage:
            print("\n📊 Coverage report generated in htmlcov/index.html")
    else:
        print(f"\n❌ Tests failed with return code {return_code}")
    
    return return_code

if __name__ == "__main__":
    sys.exit(main())
