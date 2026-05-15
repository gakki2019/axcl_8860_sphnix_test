# Installation Guide

## Purpose

This page describes the recommended preparation steps for building and browsing the AXCL SDK documentation and for setting up an environment that can run SDK examples.

## Recommended Preparation

- Confirm the supported operating system and Python environment used by the documentation build.
- Prepare a compiler toolchain and runtime dependencies required by the SDK.
- Verify that the documentation repository is checked out with the expected branch or tag.

## Documentation Build Preparation

The documentation site is built with Sphinx and supports both reStructuredText and Markdown content.

Typical preparation includes:

1. Install Python and the documentation dependencies listed in `docs/requirements.txt`.
2. Run the Sphinx HTML build from the `docs` directory.
3. Open the generated content under `docs/build/html` for local review.

## SDK Environment Preparation

Before running SDK samples or integrating AXCL into a project, make sure the following items are ready:

- Device access permissions.
- Required shared libraries and runtime packages.
- Model files, sample data, or test assets used by the first validation flow.

## Next Step

After the environment is ready, continue with [Quick Start](quick_start.md) for a minimal onboarding flow.
