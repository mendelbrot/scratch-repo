---
layout: post
title: Exploring Tri-D Chess Rules
date: 2021-03-27 10:00 -0700
# edited: 2021-03-18 10:00 -0700
# categories: tri-d-chess
# tags: star-trek 3D-chess Tri-D-chess multi-level-chess
---

This post is about different alternative rules that might improve tri-d chess and make interesting use of the multiple levels.  I'm still in the process of exploring these ideas; they haven't yet crystallized into a stable set of rules.

## Existing rules summary

The [Jens Meder rules](http://meder.spacechess.org/3dschach/chess3d.htm) are a fairly accessible reference. See 3.1 for movement rules. Other versions are similar.

Here's my quick summary of standard tri-d chess movement rules:  

Pieces move as in normal chess when viewed from above.  A piece can end its move on any of the squares in the column it moves to.  A path-mover is blocked by any piece in a column it moves through, although it can end it's move in the column of the blocking piece. 

I Used the word *column* here: I define a column as a set of squares that overlap when viewing the board from directly above.

## Stationary half-levels: Random board arrangement

Recall for standard tri-d chess that the attack boards (which I call *half-levels*) can move and invert.  

I prefer not to play with inverting half-levels.  I also do not move them during the game.  Instead, I will randomize their locations at the start of the game.  The player who moves second chooses the side of the board they will play from - that is, the side that they think will give them the advantage based on the arrangement of the half-levels.  The idea is that this advantage will compensate for the disadvantage of moving second.

I don't put the half-levels in any random positions, I have a process for selecting a nice balanced random placement.

There are twelve half-level locations, three in each quadrant of the board.  Each of these sets of three locations I call a *triad*.  Each player has two triads on their side of the board.  

This is how the half-levels are placed:  One one side of the board, randomly place a half-level on any of the three spots on one of the triads.  Then place a half-level on a spot on the triad beside it: this time, randomly choose between the two spots that do not correspond to the one that was chosen on the first triad.  Repeat this process on the other side of the board.  The total number of random starting positions is `3*2*3*2 = 36`.  In contrast, the total number of ways to place the levels with no restrictions is `C(12,4) = 495`.

## Starting piece arrangement

My starting arrangement is slightly different than standard tri-d chess.  It's depicted below. 

![setup diagram](/assets/images/star-trek-chess/setup-diagram.svg)

The pieces in the diagram are from [this source](https://commons.wikimedia.org/wiki/File:Chess_Pieces_Sprite.svg#/media/File:Chess_Pieces_Sprite.svg). I have modified them. [This is a bit of a digression, for tri-d chess I'm working on making flat pieces that I laser cut and etch out of 1/4" plywood.  I prefer flat pieces because they don't fall over, they are easier to move on the board, and there is no height constraint in making the chess set tall enough to accommodate the king height (tournament standard is 3 3/4", or 9.5cm).  The pieces are all the same colour but the direction that the piece is pointing indicates the owner.  These are [Shogi](https://en.wikipedia.org/wiki/Shogi) inspired pieces that allow experimenting with Shogi capture rules.]

## Castling

My castling rule is, the king can swap places with any other piece.  Castling can only be done as the first move of the game.  

Optional extra castling rule: If the king castles with the queen-side bishop, then that bishop and the queen will also swap places.  This is to ensure that the two bishops cover complementary squares.

## Distance

When I ran into problems with not having enough buffer between the two sides, it was actually because of the random starting positions of the half-levels.  When a player starts with a level in an advanced position, they might have an unreasonable amount of early control over squares on the other player's side.  When both players have levels in advanced positions, it might be possible for pieces to capture as a first move.  Neither of these are desirable.  My fix was to create rules for moving between boards.  There are two rules.  

First, moving directly between any two different half-levels is not allowed.  

Second, the boards are divided into three zones: bottom, middle, and top.  The bottom zone is the bottom main level and any half-levels connected to it.  Likewise for middle and top.  Moving directly between the bottom zone and the top zone is not allowed.  

## The pawns on the corners: Pawn drop

With the existing rules, the pawns on the outer corners of the half-levels can not advance, they can only move by capture or by moving the half-level.  My fix is a rule I call *pawn drop*.

The center main level is divided into two pawn drop areas.  A player's pawn drop area is the eight squares on their side of the center main board.  

As a move, a pawn on a half-level can drop onto its player's pawn drop area.  A pawn drop can only be made as a non-capturing move.  

A pawn on a half level can also make a standard move or capture if it is able to.

I also have the rule that a pawn cannot move onto a half-level.

## 2d / 3d movement: Hook-move and imaginary squares

In trying to make the game more 3d, I've been reading about other forms of 3d chess and searching for Ideas I can apply.  The hook move idea that I found in an old book by R. Wayne Schmittberger stood out as a promising avenue.  I found it at the library, and it's called [New Rules for Classic Games (1992)](https://boardgamegeek.com/boardgame/10904/new-rules-classic-games). 

This book has a section about 3d chess and mentions the checkmate problem.  In order to checkmate in 3d chess, with two rooks for example, a rook would need to be able to cut off an entire plane.  It could do that if, as it's move, it were able to go any number of steps in one direction, and then any number of steps in an orthogonal direction.  Such a piece that combines two moves as a single move is called a *hook-mover*. This diagram illustrates the idea:

![hook move concept](/assets/images/star-trek-chess/hook-concept.svg)

The hook-mover concept combines nicely with the geometry of the tri-d chess board.

Notice how the squares of the tri-d chess board are a subset of the squares of a 3d grid with dimensions 6x10x6 (6 wide, 10 long, and 6 high, for a total of 360 locations).  Of the locations in that grid, only 64 are actual squares on the tri-d chess levels.  I will call the rest of those locations *imaginary squares*.  

In these rules, a path-mover can travel trough imaginary squares (of course it has to finish its move on an actual square).  Also, for a hook mover, the "elbow" of a hook move can be an imaginary square.  

To illustrate this geometry, the diagram below has, on the left, a view of the board from above, and on the right, a 2d slice of the board from the side.  The corresponding levels are colour coded.  

The diagram on the right has a grid that represents the imaginary squares (it doesn't show the full 3d grid).  This diagram also shows how the main levels are two squares offset horizontally and vertically, and the half-levels are one square above their main levels.

The center main board is yellow, and in the left diagram there is a line dividing it in half.  The two halves of this board are the pawn drop areas discussed in that section.

![chess board levels](/assets/images/star-trek-chess/levels.svg)

The hook move works well for traveling between levels, but it also might make the pieces a bit too powerful on its own level.  For instance, a hook move rook on an empty level would cover every square.  

To compensate for this, you can forbid a hook move from starting and ending on the same level.

Here are diagrams illustrating hook movement for the bishop and rook.

| ![hook move bishop](/assets/images/star-trek-chess/hook-b.svg) | ![hook move rook](/assets/images/star-trek-chess/hook-r.svg) |

For the bishop moves, keep in mind that the half-levels are one step above the main levels they're attached to, and the second main level is two steps above the first main level. The squares in grey would be legal moves for the bishop except that they would start and end on two different half-levels (see the distance section).

The squares in grey for the rook move would be legal except there is a block.  (a piece is in a column along the path)

The hook move concept can apply to the bishop, rook, and queen.  The king, knight, and pawn, are so far still column-movers.

A *column mover* is my word for a piece that moves like in standard tri-d chess.  My strategy is currently to keep the standard tri-d chess rules as the baseline, and then swap them out on a piece by piece basis as I discover other interesting rules.

## Another kind of multi-level game

As and alternative to the 3d and hook-move ideas, or perhaps to complement them, another branch of multi-level variations to explore is pieces that move differently when they are on their own level, versus when they are moving to a different level.  Here's a concrete example.

A piece that moves like a king and like a knight is called a [centaur](https://en.wikipedia.org/wiki/Centaur_(chess)).  As a variant of the centaur for multi-level chess, what about a piece that moves like a king on its own level, but like a knight when jumping to a different level.  These types of fairy pieces are a completely different way of leveraging the multi-level nature of the chess set.  The diagram on the left shows the movement of a centaur.  The diagram on the right shows a multi-level variant that moves like a king on its own level and like a knight when jumping to another level.

| ![centaur](/assets/images/star-trek-chess/centaur-2.svg) | ![multi-level-centaur](/assets/images/star-trek-chess/centaur-1.svg) |

## Multi-level approximations of 3d movement

While writing this post I realized that rules described in terms of levels, like the multi-level centaur, can be used to create simplified approximations of 3d and hook movement.  The benefit is that multi-level descriptions are easier for people to understand and apply.  At the same time these descriptions can be tailored to retain the essence of the 3d geometry.

The multi-level bishop, based on the 3d hook-move bishop: 

1. Moves like a bishop on its own level.
2. When traveling a vertical distance of 1 between a main level and a half-level: can make a knight hop, or make a single square move in a horizontal direction.
3. When traveling a vertical distance of 2 between two main levels: can jump to its corresponding square on the other level (2 up and 2 to the side in the direction of the other level) and (optionally) continue the move by making a regular bishop move from that location.
4. Can not to perform a move like (3) if the corresponding square on the other level is occupied.  If the corresponding square is occupied by an opposing piece, then the bishop can move to take that piece.

The multi-level queen is based on a 3d non-hook-move queen that can move tri-diagonally.  (Tri-diagonal is an archaic term that means diagonal in two dimensions simultaneously in 3d space. Two cubes are diagonal if they touch at one edge, they are tri-diagonal if they touch at one corner.)  

This queen:

1. Moves like a queen on its own level.
2. When traveling a vertical distance of 1 between a main level and a half-level: can move like a king.
3. When traveling a vertical distance of 2 between two main levels: can jump two squares horizontally or diagonally in any direction.
4. Can move vertically any number of squares provided that there is no blocking piece along the path, and the move doesn't violate the distance rules. (Travel between different half-levels or between the top and bottoms zones is not allowed)

## Shogi-style capture and drops

I play with flat pieces that are somewhat arrow shaped, and the direction the piece is pointing indicates who it belongs to.  This allows playing with the [shogi drop rules](https://en.wikipedia.org/wiki/Shogi#Drops).  This looks like a promising avenue, but I haven't done enough experimenting to say more on it yet.  

