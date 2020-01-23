#pragma once

#include "Vec2f.h"
#include "PathSegment.h"
#include <vector>

class Point {
public:
	Point(Vec2f pos);
	Point(Vec2f startPos, Vec2f velocity);
	Point(float px, float py, float vx, float vy);
	Vec2f getPos() const;
	Vec2f getPos(float t) const;
	Vec2f getVelocity() const;
	std::vector<PathSegment> travelTimes(const Point& dest, float speed, float startTime) const;
private:
	Vec2f startPos;
	Vec2f velocity;
};
