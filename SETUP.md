# Velune theme setup

This is an unpublished Shopify Online Store 2.0 theme. The preview_mode setting defaults to true and hides purchase forms, checkout buttons and prices. Keep storefront password protection enabled: a theme setting cannot block Shopify checkout endpoints or other sales channels. Do not enable sales or publish without product and fulfillment confirmation.

## Shopify preparation

1. Connect this repository branch as an unpublished theme, or upload the ZIP containing only assets, config, layout, locales, sections, snippets and templates.
2. Create a draft Apple Crumble product. The intended handle is apple-crumble. Assign the default product template. Confirm supplier composition, final imagery, pricing and labeling before publishing the product to a sales channel.
3. Upload actual product photography when available. Current images are design mockups. Product images and description override template fallback artwork and copy. For other products, customize the section text and scent story with a separate product template.
4. In the editor choose the featured product for the hero, featured candle and collection preview. Create the all-products collection as needed.
5. Create delivery, returns and contact pages, fill them with confirmed content and choose them in Footer settings. Until then the theme uses conventional /pages/... links.
6. All section text, imagery and blocks are editable in Shopify. Product metadata comes from the native product object. Optional custom.short_description is a single-line text metafield.

## Theme files

JSON templates: index, collection, product, page, cart, 404 and password. Header and footer are section groups. Native product and cart forms exist behind preview_mode for future activation. No payment setup or third-party fulfillment integration is included.

Local preview renders the same Liquid sections with fixture Shopify objects; it does not execute the Shopify backend. Shopify upload and real storefront validation require access to the store.
