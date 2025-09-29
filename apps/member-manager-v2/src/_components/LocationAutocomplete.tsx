import React, { useState, useEffect, useCallback } from 'react'
import { Box, TextField, Autocomplete, AutocompleteInputChangeReason, Typography } from '@mui/material'
import { LocationAutocompleteProps, GooglePlace, LocationResult } from '../types'

// Props for the component

// Google Maps API Key - Replace with your actual API key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({ label = "Search address", value = '', onChange }) => {
  const [inputValue, setInputValue] = useState(value)
  const [suggestions, setSuggestions] = useState<GooglePlace[]>([])
  const [autocompleteService, setAutocompleteService] = useState<any>(null)
  const [placesService, setPlacesService] = useState<any>(null)
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Initialize Google Maps services
  const initializeMapsServices = useCallback(() => {
    console.log("🔧 Initializing Google Maps services...")
    if (window.google && window.google.maps) {
      try {
        console.log("🔧 Google Maps loaded, creating services")
        const autocompleteService = new window.google.maps.places.AutocompleteService()
        const placesService = new window.google.maps.places.PlacesService(
          document.createElement('div')
        )
        
        setAutocompleteService(autocompleteService)
        setPlacesService(placesService)
        console.log("✅ Google Maps services initialized successfully")
        
        // Test the services
        if (autocompleteService) {
          console.log("🧪 Testing autocomplete service with 'test' input")
          autocompleteService.getPlacePredictions(
            { input: 'test', types: ['address'] },
            (predictions: any, status: any) => {
              console.log("📊 Autocomplete test status:", status)
              console.log("📊 Autocomplete test result:", predictions)
            }
          )
        }
      } catch (error) {
        console.error("❌ Error initializing Google Maps services:", error)
        setError(`Error initializing Google Maps: ${error}`)
      }
    } else {
      console.warn("⚠️ Google Maps not available yet")
      setError("Google Maps not available")
    }
  }, [])
  
  // Function to load Google Maps script
  const loadGoogleMapsScript = useCallback(() => {
    console.log("🌎 Loading Google Maps script...")
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      console.log("✅ Google Maps already loaded")
      initializeMapsServices()
      setGoogleScriptLoaded(true)
      return
    }
    
    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api"]')
    if (existingScript) {
      console.log("⏳ Google Maps script is already loading")
      // Script is already loading, wait for it
      const checkGoogleExists = setInterval(() => {
        console.log("🔍 Checking if Google Maps is loaded...")
        if (window.google && window.google.maps && window.google.maps.places) {
          console.log("✅ Google Maps loaded via existing script")
          clearInterval(checkGoogleExists)
          initializeMapsServices()
          setGoogleScriptLoaded(true)
        }
      }, 100)
      return
    }
    
    // Set up callback function
    window.initGoogleMapsAutocomplete = () => {
      console.log("✅ Google Maps callback executed")
      initializeMapsServices()
      setGoogleScriptLoaded(true)
    }
    
    // Set up error handler
    const handleScriptError = () => {
      const errorMsg = "Failed to load Google Maps API"
      console.error("❌ " + errorMsg)
      setError(errorMsg)
      setGoogleScriptLoaded(false)
    }
    
    // Load script
    console.log("📝 Creating new Google Maps script tag")
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMapsAutocomplete`
    script.async = true
    script.defer = true
    script.onerror = handleScriptError
    document.head.appendChild(script)
    console.log("📌 Google Maps script tag added to document")
  }, [initializeMapsServices])
  
  // Load Google Maps script on component mount
  useEffect(() => {
    console.log("🚀 Component mounted, loading Google Maps")
    loadGoogleMapsScript()
    
    // Clean up on unmount
    return () => {
      console.log("🧹 Component unmounting, cleaning up")
      if (window.initGoogleMapsAutocomplete) {
        window.initGoogleMapsAutocomplete = undefined
      }
    }
  }, [loadGoogleMapsScript])

  // Update inputValue when prop value changes
  useEffect(() => {
    if (value) {
      console.log("📝 Updating input value from prop:", value)
      setInputValue(value)
    }
  }, [value])
  
  // Handle address input change
  const handleAddressInputChange = (
    event: React.SyntheticEvent,
    newValue: string,
    reason: AutocompleteInputChangeReason
  ) => {
    setInputValue(newValue)
    
    if (!newValue || !autocompleteService || newValue.length < 3) {
      console.log("⏭️ Skipping autocomplete, input too short or service unavailable")
      return
    }
    
    console.log("🔍 Getting place predictions for:", newValue)
    
    autocompleteService.getPlacePredictions(
      { 
        input: newValue, 
        types: ['address']
      },
      (predictions: GooglePlace[] | null, status: any) => {
        if (status !== window.google?.maps.places.PlacesServiceStatus.OK) {
          console.log("❌ AutocompleteService status:", status)
          setSuggestions([])
          setError(`Error getting predictions: ${status}`)
          return
        }
        
        console.log("✅ Received predictions:", predictions)
        setSuggestions(predictions || [])
        setError(null)
      }
    )
  }
  
  // Handle address selection
  const handlePlaceSelect = (
    event: React.SyntheticEvent,
    value: string | GooglePlace | null,
    reason?: string,
    details?: any
  ) => {
    if (!value || typeof value === 'string' || !placesService) {
      console.log("⏭️ Skipping place selection, invalid value or service unavailable")
      return
    }
    
    console.log("🎯 Selected place:", value)
    
    placesService.getDetails(
      { 
        placeId: value.place_id, 
        fields: ['formatted_address', 'geometry', 'address_component'] 
      },
      (place: any, status: any) => {
        if (status !== window.google?.maps.places.PlacesServiceStatus.OK) {
          console.log("❌ PlacesService getDetails status:", status)
          setError(`Error getting place details: ${status}`)
          return
        }
        
        console.log("✅ Place details:", place)
        
        // Parse address components
        let city = ''
        let state = ''
        let street = ''
        let streetNumber = ''
        let postalCode = ''
        let country = ''
        
        place.address_components.forEach((component: any) => {
          const types = component.types
          
          if (types.includes('locality')) {
            city = component.long_name
          } else if (types.includes('administrative_area_level_1')) {
            state = component.short_name
          } else if (types.includes('route')) {
            street = component.long_name
          } else if (types.includes('street_number')) {
            streetNumber = component.long_name
          } else if (types.includes('postal_code')) {
            postalCode = component.long_name
          } else if (types.includes('country')) {
            country = component.long_name
          }
        })
        
        // Create location result
        const location: LocationResult = {
          formattedAddress: place.formatted_address,
          street,
          streetNumber,
          city,
          state,
          postalCode,
          country,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        }
        
        // Set input value to formatted address
        setInputValue(place.formatted_address)
        
        // Call onChange with location data
        console.log("📣 Calling onChange with location:", location)
        onChange(location)
        setError(null)
      }
    )
  }
  
  return (
    <Box>
      <Autocomplete
        value={null}
        inputValue={inputValue}
        onChange={handlePlaceSelect}
        onInputChange={handleAddressInputChange}
        options={suggestions}
        getOptionLabel={(option: any) => {
          // Handle both string inputs and GooglePlace objects
          return typeof option === 'string' ? option : option.description || ''
        }}
        isOptionEqualToValue={(option, value) => {
          if (!option || !value) return false
          return option.place_id === value.place_id
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={!googleScriptLoaded ? "Loading Google Maps..." : "Type to search..."}
            fullWidth
            variant="outlined"
            helperText={!googleScriptLoaded ? "Loading Google Maps API..." : "Type at least 3 characters to search"}
            error={!googleScriptLoaded && inputValue.length > 3 && suggestions.length === 0}
          />
        )}
        noOptionsText={!googleScriptLoaded ? "Google Maps is loading..." : 
                       inputValue.length < 3 ? "Type at least 3 characters" : 
                       "No suggestions found"}
        filterOptions={(x) => x}
        freeSolo
        disabled={!googleScriptLoaded}
      />
      {!googleScriptLoaded && inputValue.length > 0 && (
        <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
          Google Maps API is still loading. Please wait a moment.
        </Typography>
      )}
      {error && (
        <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  )
}

export default LocationAutocomplete 