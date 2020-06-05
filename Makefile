ARCHIVE = SmartTypography.zip
DISTDIR = dist
EXTDIR = SmartTypography


all: $(EXTDIR)


$(EXTDIR):
	$(MAKE) -C $@

clean:
	rm -f $(DISTDIR)/$(ARCHIVE)


.PHONY: all $(EXTDIR) clean
