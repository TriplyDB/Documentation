[TOC]

# XSLT (Extensible Stylesheet Language Transformations)

XSLT (Extensible Stylesheet Language Transformations) is a language used to transform and manipulate XML data. However, it's not limited to XML alone. XSLT can also be used to transform and manipulate data in various other formats. With XSLT, you have the capability to create rules and transformations that convert data documents into different formats or structures.

## Example

Here's an example of an XML file, an XSLT stylesheet, and the resulting output in RDF format (Linked Data) after applying the XSLT transformation. In this example, we'll transform a simple XML representation of books into RDF triples.

### Input XML file (books.xml)

```
<?xml version="1.0" encoding="UTF-8"?>
<library>
  <book>
    <title>The Great Gatsby</title>
    <author>F. Scott Fitzgerald</author>
  </book>
  <book>
    <title>1984</title>
    <author>George Orwell</author>
  </book>
</library>
```
### XSLT Stylesheet (books-to-rdf.xsl)

```
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
      <xsl:for-each select="library/book">
        <rdf:Description>
          <rdf:type rdf:resource="http://example.org/book" />
          <rdf:Description>
            <rdf:type rdf:resource="http://example.org/author" />
            <rdf:value>
              <xsl:value-of select="author" />
            </rdf:value>
          </rdf:Description>
          <rdf:title>
            <xsl:value-of select="title" />
          </rdf:title>
        </rdf:Description>
      </xsl:for-each>
    </rdf:RDF>
  </xsl:template>
</xsl:stylesheet>
```

### Output RDF (result.rdf) after applying XSLT

```
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description>
    <rdf:type rdf:resource="http://example.org/book" />
    <rdf:Description>
      <rdf:type rdf:resource="http://example.org/author" />
      <rdf:value>F. Scott Fitzgerald</rdf:value>
    </rdf:Description>
    <rdf:title>The Great Gatsby</rdf:title>
  </rdf:Description>
  <rdf:Description>
    <rdf:type rdf:resource="http://example.org/book" />
    <rdf:Description>
      <rdf:type rdf:resource="http://example.org/author" />
      <rdf:value>George Orwell</rdf:value>
    </rdf:Description>
    <rdf:title>1984</rdf:title>
  </rdf:Description>
</rdf:RDF>
```
## Using XSLT in TriplyETL

In TriplyETL, XSLT processing is supported in the `fromXML()` and `loadRdf()` middlewares by providing an optional `Source.file()` to the stylesheet parameter that uses an XSL-XML Stylesheet. Below we will explain in steps how it can be used:

1\. Create your XSLT stylesheet: 

First, you need to create an XSLT stylesheet. This stylesheet defines the rules for transforming your XML data. It should have a .xslt or .xsl file extension. You can create this stylesheet using any text editor or XML/XSLT development tool. In your case, it seems you can provide this stylesheet as an optional Source.file(). Make sure you have this stylesheet ready.

2\. Use XSLT in `fromXml()` or `loadRdf()` by providing an extra parameter:

- `fromXml()`

```
fromXml(Source.file(xml), {
        selectors: "rdf:RDF.sdo:Person",
        stylesheet: Source.file(stylesheet),
      })
```

- `loadRdf()`:

```
loadRdf(Source.file(xml), {
        contentType: "application/rdf+xml",
        stylesheet: Source.file(xsl),
      }),
```