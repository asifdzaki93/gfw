/**
 * The Countries.
 *
 */
define([
  'backbone',
  'underscore', 
  'chosen',
  'map/presenters/tabs/CountriesPresenter',
  'map/collections/CountryCollection',
  'handlebars',
  'text!map/templates/tabs/countries.handlebars',
  'text!map/templates/tabs/countriesMore.handlebars',
  'text!map/templates/tabs/countriesMobile.handlebars',
], function(Backbone, _, chosen, Presenter, CountryCollection, Handlebars, tpl, tplMore, tplMobile) {

  'use strict';

  var LayersCountryView = Backbone.View.extend({

    el: '#countries-tab',

    template: Handlebars.compile(tpl),
    templateMore: Handlebars.compile(tplMore),
    templateMobile: Handlebars.compile(tplMobile),

    model: new (Backbone.Model.extend({
      country: null,
      countryName: null,
      countryLayers: null,
      mobile: null,
      letter: null
    })),

    events: {
      // Country select change
      'change #countries-country-select' : 'changeIso',
      // Layer click
      'click .layer': 'changeLayer',
      'click .wrapped-layer': 'changeWrappedLayer',
      
      // Mobile Events
      'click #country-letters li' : 'changeLetter',
      'click #country-ul li' : 'changeIsoMobile',
    },

    initialize: function(map, countries) {
      // Init presenter
      this.presenter = new Presenter(this);        
      this.map = map;
      this.countries = countries;
      
      // MOBILE
      enquire.register("screen and (min-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.model.set('mobile', false);
          this.render();
          this.listeners();
        },this)
      });

      // DESKTOP
      enquire.register("screen and (max-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.model.set('mobile', true);
          this.render();
          this.listeners();
        },this)
      });
    },

    render: function() {
      // Render different templates depending on the device
      var template = (this.model.get('mobile')) ? this.templateMobile : this.template;
      this.$el.html(template({
        countries: this.countries.toJSON(),
        country: this.model.get('country'),
        countryName: this.model.get('countryName') || 'Country',
        countryLayers: this.model.get('countryLayers'),
        // mobile params
        alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
      }));

      this.cache();
      this.chosen();
    },




    // INITS
    listeners: function() {
      this.model.on('change:country', this.setCountryLayers.bind(this));
      this.model.on('change:country', this.setCountryMobileButtons.bind(this));

      this.model.on('change:letter', this.setLetter.bind(this));
      this.model.on('change:letter', this.setCountryUl.bind(this));
    },

    cache: function() {
      this.$select = this.$el.find('#countries-country-select');
      this.$more = this.$el.find('#countries-more');
      // mobile vars
      this.$countryLetters = this.$el.find('#country-letters');
      this.$countryUl = this.$el.find('#country-ul');

      // These buttons belong to the tabs-mobile.handlebars
      // Any recommendation?
      this.$countryBtnReset = $('#country-tab-mobile-btn-reset');
      this.$countryBtnBack = $('#country-tab-mobile-btn-back');
    },


    chosen: function() {
      this.$select.val(this.model.get('country'));
      this.$select.chosen({
        width: '100%',
        allow_single_deselect: true,
        inherit_select_classes: true,
        no_results_text: "Oops, nothing found!"
      })
    },

    more: function(data) {
      this.$more.html(this.templateMore(data));
    },




    // SETTERS
    setLayers: function(layers) {
      this.model.set('layers', layers);
    },

    setCountry: function(iso) {
      var country = (!!iso && !!iso.country) ? iso.country : null; 
      var countryName = (!!iso && !!iso.country) ? _.findWhere(this.countries.toJSON(), {iso: iso.country }).name : null;
      this.model.set('countryName', countryName);
      this.model.set('country', country);
      // Mobile
      this.model.set('letter', null); 

      // Load the third button if it exists
      this.presenter.countryMore();      
    },

    setCountryLayers: function() {
      var country = this.model.get('country');
      var layers = this.model.get('layers');
      if (!!country) {
        var countryLayers = _.where(layers, {iso: country});
        this.model.set('countryLayers', countryLayers);
      } else {
        this.model.set('countryLayers', null);
      }
      this.render();
    },




    // MOBILE SETTERS
    setLetter: function() {
      var letter = this.model.get('letter');
      this.$countryLetters.find('li').removeClass('-active');
      if (!!letter) {
        this.$countryLetters.find('[data-letter="'+letter+'"]').addClass('-active');
      }
    },

    setCountryUl: function() {
      var letter = this.model.get('letter');
      if (!!letter) {
        this.$countryUl.find('li').addClass('-no-visible');
        this.$countryUl.find('[data-letter="'+letter+'"]').removeClass('-no-visible');
      } else {
        this.$countryUl.find('li').removeClass('-no-visible');
      }
    },

    setCountryMobileButtons: function() {
      var country = this.model.get('country');
      this.$countryBtnReset.toggleClass('invisible', ! !!country);
      this.$countryBtnBack.toggleClass('invisible', !!country);
    },



    // EVENTS //
    changeIso: function(e) {
      var country = this.$select.val();
      this.presenter.publishIso({
        country: country, 
        region: null
      });
    },

    // Layers
    changeLayer: function(e) {
      e && e.preventDefault() && e.stopPropagation();
      var is_source = $(e.target).hasClass('source') || $(e.target).parents().hasClass('source');
      var is_wrapped = $(e.target).hasClass('wrapped') || $(e.target).parents().hasClass('wrapped');
      
      // this prevents layer change when you click in source link or in a wrapped layer
      if (!is_source && !is_wrapped) {
        var layerSlug = $(e.currentTarget).data('layer');
        this.publishToggleLayer(layerSlug);
      }      
    },

    changeWrappedLayer: function(e) {
      e && e.preventDefault() && e.stopPropagation();
      var is_source = $(e.target).hasClass('source') || $(e.target).parents().hasClass('source');
      var is_wrapped = $(e.target).hasClass('wrapped');
      var $layers = $(e.currentTarget).find('.layer');

      if (!is_source) {
        if (is_wrapped) {
          // selected index & clicked index
          var $selected = $layers.filter('.selected'),
              indexSelected = $layers.index($selected),

              $clicked = $layers.filter($(e.target)),
              index = $layers.index($clicked);

          if (indexSelected != index) {
            var layerSlug = $($layers[indexSelected]).data('layer');
            this.publishToggleLayer(layerSlug);
          }

        } else {
          var $selected = $layers.filter('.selected'),
              index = ($layers.index($selected) == -1) ? 0 : $layers.index($selected);          
        }

        // Publish toggle layer
        var layerSlug = $($layers[index]).data('layer')
        this.publishToggleLayer(layerSlug);
      }
    },

    publishToggleLayer: function(layerSlug) {
      this.presenter._toggleLayer(layerSlug);
      ga('send', 'event', 'Map', 'Toggle', 'Layer: ' + layerSlug);
    },





    // MOBILE EVENTS
    changeIsoMobile: function(e) {
      var country = $(e.currentTarget).data('country');
      this.presenter.publishIso({
        country: country, 
        region: null
      });
    },

    changeLetter: function(e){
      var $current = $(e.currentTarget),
          disabled = $current.hasClass('-disabled'),
          // Check if the current letter isn't enabled
          letter = (!$current.hasClass('-current')) ? $current.data('letter') : null;
      if (!disabled) {
        this.model.set('letter', letter);  
      }
    },  




    // SELECTED LAYERS
    _toggleSelected: function(layers) {
      var activeLayers = _.keys(layers);
      
      _.each(this.model.get('countryLayers'), function(layer){
        if (!layer.wrappers) {
          // Toggle simple layers
          var $layer = this.$el.find('[data-layer="'+layer.slug+'"]'),
              $toggle = $layer.find('.onoffradio, .onoffswitch'),
              // Is selected?
              is_selected = _.contains(activeLayers, layer.slug);
          
          $layer.toggleClass('selected', is_selected);
          $toggle.toggleClass('checked', is_selected).css('background', (is_selected) ? layer.title_color : '');
        
        } else {
          // Toggle wrapped layers
          var $wraplayer = this.$el.find('[data-layer="'+layer.slug+'"]'),
              $wraptoggle = $wraplayer.find('.onoffradio, .onoffswitch'),
              layers = layer.wrappers,
              is_wrapSelected = false;

          _.each(layer.wrappers, function(_layer){
            var $layer = this.$el.find('[data-layer="'+_layer.slug+'"]'),
                is_selected = _.contains(activeLayers, _layer.slug);

            $layer.toggleClass('selected', is_selected);
            
            if (is_selected) {
              is_wrapSelected = true;
            }

          }.bind(this));

          $wraplayer.toggleClass('selected', is_wrapSelected);
          $wraptoggle.toggleClass('checked', is_wrapSelected).css('background', (is_wrapSelected) ? '#cf7fec' : '');

        }
      }.bind(this));
    },

  });

  return LayersCountryView;

});
