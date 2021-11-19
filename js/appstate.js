'use strict'

import Input from "./input.js"
import {PerspectiveCamera, OrthographicCamera} from "./camera.js"
import {OrbitMovement, RaycastMovement} from './movement.js'

class AppState
{

    constructor( app )
    {

        this.app = app
        this.is_selecting = false

        // get list of ui indicators
        this.ui_categories = {

            "camera_mode":
            {

                "fps": document.getElementById( "fpsCamMode" ),
                "stationary": document.getElementById( "statCamMode" )

            },
            "projection_mode":
            {

                "perspective": document.getElementById( "perspProjMode" ),
                "orthographic": document.getElementById( "orthoProjMode" )

            },
            "selection":
            {

                "raycasting": document.getElementById( "selectionRaycasting" ),
                "target": document.getElementById( "selectionTarget" )

            },
            "shading":
            {

                "wireframe": document.getElementById( "wireframeShading" ),
                "flat": document.getElementById( "flatShading" )
            },
            "ShadingModel":
            {
                "Phong": document.getElementById( "PhongShading" ),
                "Gouraud": document.getElementById( "GouraudShading" ),
                "Flat": document.getElementById( "FlatShading" )
            }
        }

        // update ui with default values
        this.updateUI( "camera_mode", "stationary" )
        this.updateUI( "shading", "flat" )
        this.updateUI( "projection_mode", "perspective" )
        this.updateUI( "selection", "target" )
        this.updateUI("ShadingModel", "Phong" )

    }

    /**
     * Updates the app state by checking the input module for changes in user input
     */
    update( )
    {

        // Shading Input
        if ( Input.isKeyDown( "1" ) ) {
            this.app.shader = this.app.wireframe_shader
            this.updateUI("shading", "wireframe")
        } else if ( Input.isKeyDown( "2" ) ) {
            this.app.shader = this.app.flat_shader
            this.updateUI("shading", "flat")
        }
        
        if ( Input.isKeyDown( "g" ) ) {
            this.app.shader = this.app.Phong_shader
            this.updateUI("ShadingModel", "Phong")
        } else if ( Input.isKeyDown( "d" ) ) {
            this.app.shader = this.app.Gouraud_shader
            this.updateUI("ShadingModel", "Gouraud")
        } else if ( Input.isKeyDown( "f" ) ) {
            this.app.shader = this.app.flat_shader
            this.updateUI("ShadingModel", "Flat")
        } 
 

        // Camera Input
        if ( Input.isKeyDown( "o" ) ) {
            this.app.camera = new OrthographicCamera(this.app.camera.position, this.app.camera.look_at, this.app.camera.up, this.app.camera.fovy, this.app.camera.aspect, this.app.camera.near, this.app.camera.far)
            this.app.movement.camera = this.app.camera
            this.app.initCamera()
            this.updateUI("projection_mode", "orthographic")
        } else if ( Input.isKeyDown( "p" ) ) {
            this.app.camera = new PerspectiveCamera(this.app.camera.position, this.app.camera.look_at, this.app.camera.up, this.app.camera.fovy, this.app.camera.aspect, this.app.camera.near, this.app.camera.far)
            this.app.movement.camera = this.app.camera
            this.app.initCamera()
            this.updateUI("projection_mode", "perspective")
        }

        // Raycasting
        if ( Input.isKeyPressed( "r" ) && !this.is_selecting) {
            console.log("Raycast on")
            this.app.movement = new RaycastMovement(this.app)
            this.updateUI("selection", "raycasting")
            this.is_selecting = true
        } else if (Input.isKeyPressed( "r" ) && this.is_selecting) {
            this.app.movement = new OrbitMovement(this.app)
            this.updateUI("selection", "target", "No Target Selected")
            this.is_selecting = false
        }

        if (this.is_selecting && this.app.movement.selected_object)
            this.updateUI("selection", "target", "Selected '"+this.app.movement.selected_object.name+"'")
    }

    /**
     * Updates the ui to represent the current interaction
     * @param { String } category The ui category to use; see this.ui_categories for reference
     * @param { String } name The name of the item within the category
     * @param { String | null } value The value to use if the ui element is not a toggle; sets the element to given string 
     */
    updateUI( category, name, value = null )
    {

        for ( let key in this.ui_categories[ category ] )
        {

            this.updateUIElement( this.ui_categories[ category ][ key ], key == name, value )

        }

    }

    /**
     * Updates a single ui element with given state and value
     * @param { Element } el The dom element to update
     * @param { Boolean } state The state (active / inactive) to update it to
     * @param { String | null } value The value to use if the ui element is not a toggle; sets the element to given string 
     */
    updateUIElement( el, state, value )
    {

        el.classList.remove( state ? "inactive" : "active" )
        el.classList.add( state ? "active" : "inactive" )

        if ( state && value != null )
            el.innerHTML = value

    }

}

export default AppState
