ARCHIVE = SmartTypography.zip
DISTDIR = ../dist
EXTDIR = SmartTypography


all: $(DISTDIR)/$(ARCHIVE)


$(DISTDIR)/$(ARCHIVE):
	rm -f $(DISTDIR)/$(ARCHIVE)
	zip -r $(DISTDIR)/$(ARCHIVE) . --exclude "*.DS_Store" "*Makefile"


.PHONY: all
