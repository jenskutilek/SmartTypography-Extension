ARCHIVE = SmartTypography.zip
DISTDIR = dist
EXTDIR = SmartTypography


all: $(DISTDIR)/Chrome/$(ARCHIVE)

$(DISTDIR)/Chrome/$(ARCHIVE):
	rm -f $(DISTDIR)/Chrome/$(ARCHIVE)
	zip -r $(DISTDIR)/Chrome/$(ARCHIVE) $(EXTDIR)/ --exclude "*.DS_Store" "*Makefile"

clean:
	rm -f $(DISTDIR)/Chrome/$(ARCHIVE)

.PHONY: all clean
