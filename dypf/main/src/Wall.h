#pragma once

#include "Point.h"
#include "PathSearchState.h"
#include <vector>
#include <math.h>

class Wall {
public:
	Wall(Point start, Point end);
	Point start;
	Point end;
	Point getStart() const;
	Point getEnd() const;
	bool blocksPath(const PathSegment& pSeg) const;
};
