<?php
/**
 * Plugin Name: Lorem Ipsum
 * Description: Use Emmet like abbreviations to quickly create dummy content in Gutenberg. supports custom lorem word counts and block replacement.
 * Version: 1.0.0
 * Author: bPlugins
 * Author URI: https://bplugins.com
 * License: GPLv3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain: lorem-ipsum
 */

// ABS PATH
if ( !defined( 'ABSPATH' ) ) { exit; }

// Constant
define( 'LRIP_VERSION', isset( $_SERVER['HTTP_HOST'] ) && 'localhost' === $_SERVER['HTTP_HOST'] ? time() : '1.0.0' );
define( 'LRIP_DIR_URL', plugin_dir_url( __FILE__ ) );
define( 'LRIP_DIR_PATH', plugin_dir_path( __FILE__ ) );

if( !class_exists( 'LRIPPlugin' ) ){
	class LRIPPlugin{
		function __construct(){
			add_action( 'init', [ $this, 'onInit' ] );
		}

		function onInit(){
			register_block_type( __DIR__ . '/build' );
		}
	}
	new LRIPPlugin();
}