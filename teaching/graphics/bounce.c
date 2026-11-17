
/*
 * Picking Rotating Squares Demo
 *
 * This program is in the public domain
 *
 * Esdras Medeiros
 *
 *  25/09/2007
 */


#include <math.h>
#include <stdlib.h>
#include <string.h>
#include <GL/glut.h>

#define BUFSIZE 512

GLuint selectBuf[BUFSIZE];

float theta1, theta2, aspect;
GLint sel;

static void 
reshape(int width, int height)
{
  aspect = (float) width / (float) height;
  glViewport(0, 0, (GLint) width, (GLint) height);
  glMatrixMode(GL_PROJECTION);
  glLoadIdentity();
  glOrtho(-1.0 * aspect, 1.0 * aspect, -1.0, 1.0, -10.0, 10.0);
  glMatrixMode(GL_MODELVIEW);
}

/* ARGSUSED1 */
static void
key(unsigned char k, int x, int y)
{
  switch (k) {
  case 27:  /* Escape */
    exit(0);
  }
}

static void draw(void)
{

 glClear(GL_COLOR_BUFFER_BIT);

glLoadName(1);
glColor3f(1.0, 0.0, 0.0);
glPushMatrix();
glTranslatef(-0.5, 0., 0.),
glBegin(GL_POLYGON);
    glVertex2f( 0.5*cos(theta1), 0.5*sin(theta1));
    glVertex2f( -0.5*sin(theta1), 0.5*cos (theta1));
    glVertex2f( -0.5*cos(theta1), -0.5*sin(theta1));
    glVertex2f( 0.5*sin(theta1), -0.5*cos(theta1));
glEnd();
glPopMatrix();

glLoadName(2);
glColor3f(0.0, 1.0, 0.0);
glPushMatrix();
glTranslatef(0.3, 0., 0.),
glBegin(GL_POLYGON);
    glVertex2f( 0.5*cos(theta2), 0.5*sin(theta2));
    glVertex2f( -0.5*sin(theta2), 0.5*cos (theta2));
    glVertex2f( -0.5*cos(theta2), -0.5*sin(theta2));
    glVertex2f( 0.5*sin(theta2), -0.5*cos(theta2));
glEnd();
glPopMatrix();

  glFlush();
  glutSwapBuffers();
}

void idle()
{
   theta1+= M_PI/360.0;
   theta2+= M_PI/360.0;
   if(theta1 >= 360.0) theta1 -= 360.0;
   if(theta2 >= 360.0) theta2 -= 360.0;
   glutPostRedisplay();
}

 void list_hits(GLint hits, GLuint *names)
 {
 	int i;
 	
 	/*
 	For each hit in the buffer are allocated 4 bytes:
 	1. Number of hits selected (always one,
 			            beacuse when we draw each object
 		  		    we use glLoadName, so we replace the  					   prevous name in the stack)
 	2. Min Z
 	3. Max Z
 	4. Name of the hit (glLoadName)
 	*/
 	
 	printf("%d hits:\n", hits);
 	
 	for (i = 0; i < hits; i++)
 		printf(	"Number: %d\n"
 				"Min Z: %d\n"
 				"Max Z: %d\n"
 				"Name on stack: %d\n",
 				(GLubyte)names[i * 4],
 				(GLubyte)names[i * 4 + 1],
 				(GLubyte)names[i * 4 + 2],
 				(GLubyte)names[i * 4 + 3]
 				);
 	
 	printf("\n");
 }

void mouse(int button, int state, int x, int y)
{
   if(button==GLUT_LEFT && state==GLUT_DOWN)
     glutIdleFunc(idle);
   if(button==GLUT_MIDDLE_BUTTON && state==GLUT_DOWN)
     glutIdleFunc(NULL);
   if(button==GLUT_RIGHT_BUTTON && state==GLUT_DOWN)
   {
        GLint viewport[4];

	glSelectBuffer(BUFSIZE,selectBuf);
	glRenderMode(GL_SELECT);

	glMatrixMode(GL_PROJECTION);
	glPushMatrix();
	glLoadIdentity();

	glGetIntegerv(GL_VIEWPORT,viewport);
	gluPickMatrix(x,viewport[3]-y, 5,5,viewport);
	glOrtho(-1.0 * aspect, 1.0 * aspect, -1.0, 1.0, -10.0, 10.0);
	glMatrixMode(GL_MODELVIEW);
	glInitNames();
        glPushName(0);
	draw();
        
        glMatrixMode(GL_PROJECTION);
	glPopMatrix();
        int hits = glRenderMode(GL_RENDER);
	list_hits(hits, selectBuf);
        glMatrixMode(GL_MODELVIEW);
        glutPostRedisplay();
   }
   
}


int main(int argc, char *argv[])
{
  glutInit(&argc, argv);
  glutInitWindowPosition(0, 0);
  glutInitWindowSize(500, 500);

 theta1 = theta2 = 0;

  glutInitDisplayMode(GLUT_RGB | GLUT_DOUBLE);

  glutCreateWindow("Bounce");
  glutDisplayFunc(draw);
  glutReshapeFunc(reshape); 
  //glutVisibilityFunc(visible);
  //glutKeyboardFunc(key);
  glutMouseFunc(mouse);
  glutIdleFunc(idle);


  glutMainLoop();
  return 0;             /* ANSI C requires main to return int. */
}
