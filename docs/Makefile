SPHINXBUILD ?= sphinx-build
PYTHON ?= python3
SOURCEDIR = source
BUILDDIR = build
CONFDIR = source

.PHONY: help html clean report

help:
	@$(SPHINXBUILD) -M help $(SOURCEDIR) $(BUILDDIR) -c $(CONFDIR)

html:
	@$(SPHINXBUILD) -b html -c $(CONFDIR) $(SOURCEDIR) $(BUILDDIR)/html

clean:
	@rm -rf $(BUILDDIR)/html

report:
	@$(PYTHON) scripts/sphnix/generate_test_report.py
