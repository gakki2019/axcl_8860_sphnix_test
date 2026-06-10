AX8860 Development Reference
============================

This is the root entry of the AXCL documentation site. The page redirects to
Chinese documentation by default and keeps both Chinese and English entry pages
in the hidden root toctree so Sphinx can build cross-language documents.

.. raw:: html

    <script type="text/javascript">
        window.location.replace("./zh/index.html");
    </script>
    <noscript>
        <meta http-equiv="refresh" content="0; url=./zh/index.html" />
    </noscript>

For maintainers, keep this root page lightweight and move product-specific
content into the language entry pages.

.. toctree::
    :hidden:
    :maxdepth: 2

    zh/index
    en/index
