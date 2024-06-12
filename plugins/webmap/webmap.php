<?php
/*
Plugin Name: My Custom Plugin
Plugin URI: https://example.com
Description: A custom plugin to add custom HTML content to a page.
Version: 1.0
Author: Your Name
Author URI: https://example.com
License: GPL2
*/

function webmap_shortcode() {
  // Custom HTML content
  $content = '
  <div class="custom-html-content">
      <h1>Custom HTML Content</h1>
      <p>This is a custom plugin that outputs HTML content.</p>
  </div>
  ';
  return $content;
}
add_shortcode('custom_html', 'webmap_shortcode');

function webmap_enqueue_scripts() {
  wp_enqueue_style('my-custom-plugin-style', plugins_url('/css/style.css', __FILE__));
  wp_enqueue_script('my-custom-plugin-script', plugins_url('/js/script.js', __FILE__), array('jquery'), null, true);
}
add_action('wp_enqueue_scripts', 'webmap_enqueue_scripts');