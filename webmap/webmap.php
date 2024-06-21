<?php
/*
Plugin Name: wordpressMap
Plugin URI: https://github.com/AndreasRey/wordpressMap
Description: Simple leaflet map integrated into WordPress.
Version: 1.0
Author: Andreas Rey
Author URI: https://www.linkedin.com/in/andreas-rey/
License: MIT
*/

function webmap_shortcode() {
  // Custom HTML content
  $content = '
  <div class="custom-html-content">
      <div class="wordpressmap-content"></div>
  </div>
  ';
  return $content;
}
add_shortcode('wordpressmap-html', 'webmap_shortcode');

function webmap_enqueue_scripts() {
  //wp_enqueue_style('my-custom-plugin-style', plugins_url('/css/style.css', __FILE__));
  wp_enqueue_script('wordpressmap-script', plugins_url('/script.js', __FILE__), array('jquery'), null, true);
}
add_action('wp_enqueue_scripts', 'webmap_enqueue_scripts');