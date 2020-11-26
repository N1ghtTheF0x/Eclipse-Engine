#version 300 es

in vec2 a_position;
in vec2 a_texCoord;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;

out vec2 v_texCoord;

void main()
{
    vec2 rotatedPos = vec2(a_position.x*u_rotation.y+a_position.y*u_rotation.x,a_position.y*u_rotation.y-a_position*u_rotation.x);
    vec2 position = rotatedPos+u_translation;
    vec2 zto = position/u_resolution;
    vec2 ztt = zto*2.0;
    vec2 csp = ztt-1.0;
    gl_Position = vec4(csp*vec2(1,-1),0,1);
    v_texCoord = a_texCoord;
}