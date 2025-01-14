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

function webmap_shortcode($atts) {
  $atts = shortcode_atts(
      array(
          'map_type' => 'default', // Default value
      ), 
      $atts, 
      'wordpressmap-html'
  );

  $map_type = esc_attr($atts['map_type']);

  $content = '
  <div class="custom-html-content">
      <div class="wordpressmap-content" data-map-type="' . $map_type . '"></div>
  </div>
  ';
  return $content;
}
add_shortcode('wordpressmap-html', 'webmap_shortcode');

function webmap_enqueue_scripts() {
  global $post;

  if (has_shortcode($post->post_content, 'wordpressmap-html')) {
      wp_enqueue_script('wordpressmap-script', plugins_url('/script.js', __FILE__), array('jquery'), null, true);
  }
}
add_action('wp_enqueue_scripts', 'webmap_enqueue_scripts');