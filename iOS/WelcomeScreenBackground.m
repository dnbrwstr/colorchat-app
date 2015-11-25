

//
//  WelcomeScreenBackground.m
//  ColorChat
//
//  Created by Daniel Brewster on 11/23/15.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "WelcomeScreenBackground.h"
#import <QuartzCore/QuartzCore.h>
#import "Scenekit/Scenekit.h"
#import "GLKit/GLKit.h"

@implementation WelcomeScreenBackground

- (id) init
{
  self = [super init];
//
//  self.link = [CADisplayLink displayLinkWithTarget:self selector:@selector(updateStars)];
//  [self.link addToRunLoop:[NSRunLoop mainRunLoop] forMode:NSDefaultRunLoopMode];
  return self;
}

- (void) layoutSubviews
{
  [super layoutSubviews];
  [self createInitialStars];

  self.backdrop.frame = self.layer.frame;
}

- (void) createBackdrop
{
  self.backdrop = [[CALayer alloc] init];
  self.backdrop.backgroundColor = [UIColor blackColor].CGColor;
  [self.layer addSublayer:self.backdrop];
}

- (void) createInitialStars
{
  SCNView *view = [[SCNView alloc] init];
  SCNScene *scene = [SCNScene scene];
  SCNNode *cameraNode = [[SCNNode alloc] init];
  SCNNode *particleNode = [[SCNNode alloc] init];
  SCNCamera *camera = [[SCNCamera alloc] init];
  cameraNode.camera = camera;
  cameraNode.position = SCNVector3Make(0, 0, 8);
  particleNode.position = SCNVector3Make(0, 0, 0);
  particleNode.rotation = SCNVector4Make(0, 0, 0, 0);
  SCNParticleSystem *particleSystem = [SCNParticleSystem particleSystemNamed:@"WelcomeParticleSystem" inDirectory:@""];
  view.frame = self.frame;
  view.backgroundColor = [UIColor colorWithRed:.08 green:.08 blue:.08 alpha:1];
  view.scene = scene;
  [self addSubview:view];
  

  [particleNode addParticleSystem:particleSystem];
  [scene.rootNode addChildNode:particleNode];
  [scene.rootNode addChildNode:cameraNode];

//  CGRect bounds = [[UIScreen mainScreen] bounds];
//  NSLog(@"%f %f", bounds.size.height, bounds.size.width);
//  // The CAEmitterLayer class provides a particle emitter system for Core Animation
//  CAEmitterLayer *emitterLayer = [CAEmitterLayer layer];
//  emitterLayer.emitterPosition = CGPointMake(bounds.size.width / 2, bounds.size.height / 2);
//  emitterLayer.emitterSize = CGSizeMake(bounds.size.width, bounds.size.height);
//  emitterLayer.emitterMode = kCAEmitterLayerUnordered;
//  emitterLayer.renderMode = kCAEmitterLayerPoints;
//  emitterLayer.backgroundColor = [UIColor redColor].CGColor;
//
//  // The CAEmitterCell class represents one source of particles being emitted by a CAEmitterLayer object
//  CAEmitterCell *emitterCell = [CAEmitterCell emitterCell];
//  
//  CAEmitterBehavior *behavior = [CAEmitterBehavior behaviorWithType:kCAEmitterBehaviorColorOverLife];
//  
//  emitterCell.scale = 0.1;
//  emitterCell.scaleRange = 0.0;
//  
//  emitterCell.emissionRange = (CGFloat)M_PI * 2;
//  
//  emitterCell.lifetime = 20.0;
//  emitterCell.birthRate = 10.0;
//  emitterCell.velocity = 50.0;
//  emitterCell.redRange = 255.0;
//  emitterCell.greenRange = 255.0;
//  emitterCell.blueRange = 255.0;
//  emitterCell.emissionRange = 360;
//  emitterCell.alphaRange = 1.0;
//  emitterCell.alphaSpeed  = 0.5;
//  emitterCell.scaleRange = 0.1;
//  emitterCell.contents = (id)[[UIImage imageNamed:@"star-particle.png"] CGImage];
//  emitterLayer.emitterCells = @[emitterCell];
//  [self.layer addSublayer:emitterLayer];

//  self.stars = [[NSMutableArray alloc] init];
//
//  int cols = 6;
//  int rows = 10;
//  int starCount = cols * rows;
//  float colWidth = bounds.size.width / cols;
//  float rowHeight = bounds.size.height / rows;
//
//  for (int i = 0; i < starCount; ++i) {
//    int row = floor(i / cols);
//    int col = i % cols;
//    int width = 5;
//    int height = 5;
//    int jitterX = 20;
//    int jitterY = 10;
//    float x = col * colWidth + colWidth / 2 - width / 2;
//    float y = row * rowHeight + rowHeight / 2 - height / 2;
//    x = x + arc4random_uniform(jitterX * 2) - jitterX;
//    y = y + arc4random_uniform(jitterY * 2) - jitterY;
//
//    CGRect frame = CGRectMake(x, y, width, height);
//    CALayer *star = [[CALayer alloc] init];
//    star.bounds = frame;
//    star.backgroundColor = [self randomColor].CGColor;
//    NSLog(@"added star");
//    [self.stars addObject:star];
//    [self.layer addSublayer:star];
//  }
}

- (void) updateStars
{
//  CGRect bounds = [[UIScreen mainScreen] bounds];
//  float centerX = bounds.origin.x + bounds.size.width / 2;
//  float centerY = bounds.origin.y + bounds.size.height / 2;
//
//  for (int i = 0; i < self.stars.count; ++i) {
//    CALayer *star = self.stars[i];
//    float x = star.frame.origin.x;
//    float y = star.frame.origin.y;
//    float newX = floor((centerX - x) * .01 + x);
//    float newY = floor((centerY - y) * .01 + y);
//    star.frame = CGRectMake(newX, newY, star.frame.size.width, star.frame.size.height);
//    [star setNeedsDisplay];
//  }
}

- (UIColor*) randomColor
{
  float red = arc4random_uniform(255) / 255.0;
  float green = arc4random_uniform(255) / 255.0;
  float blue = arc4random_uniform(255) / 255.0;
  return [UIColor colorWithRed:red green:green blue:blue alpha:1];
}


@end