https://docs.python.org/3/reference/datamodel.html#object.__getitem__

https://docs.python.org/3/glossary.html search iterable

https://docs.python.org/3/reference/datamodel.html#object.__iter__

### Data formats that could be passed in...

Data could be passed in all at once or incrementally

#### all at once:

* another itree object
* an itree array of data from an itree object
* a list of paths
* a list of incremental inputs (lists of tuples):
```
[
	[(char, prev_node, node), ...]
]

prev_node = the previous node that this node follows from
node = the current node being considered
char  = a character specifying how this should be processed
for char:
'c' = continue: this node continues a path
'p' = prune: remove all paths that lead up to this node
'n' = end: mark this node as the end of a path
if char is 'p' then prev_node is not required
```

I'm thinking about what to call a list of incremental inputs.  They are all at the same level, same distance from a root, a full level.  Radius is appropriate.  Actually, the circumference is the set of points equally distant from the center, the radius is the line from the center to the circumference.  So maybe, by analogy, a path is a radius, a incremental inputs list is a circumference.  perhaps they can have the names `rad` and `circ` ?  `rad` and `next_circ`?

#### incrementally

* a `rad`
* the next `circ`

Also, should one be able to put in or delete the rad at a specific index?  I'm thinking probably not for put in: the object should have complete control over what index the new items go in, mainly because duplicate entries aren't useful/shouldn't be accommodated.    For remove, YES.  There should be the ability to remove items by value or by index.

#### data inputs revisited 2021-03-07

a path input can be called a *chain* a direct input adding to a dictionary item in one of the rows can be called a *link*.  

before continuing with data inputs, I think i need to clarify how the data is stored.

### data structure

```
link_data = 
[
	{<node id>: [<node id (link)>, ...], ...},
	...
]

terminals_data = 
[
	[<node id>, ... ] <-- row
	, ...
]
```

there is a limitation with this data structure: it cannot store a bunch of separate paths/chains independently.  for example: if you store these paths:

```
(1) [a, b, c]
(2) [a, e, c, d]
```

then that implies that you're automatically also storing this path:

```
(3) [a, e, c]
```

This is because: from (1), `c` is a terminal node at index 3.  the path (2) goes through c at index 3.  hence, (2) truncated at index 3 is also stored as a path.

the i-tree data structure is somewhat a generalization of a rooted tree.  It's a multi-rooted, multi-terminal rooted tree.  

multi-rooted because it's a set of rooted trees sharing the same nodes, and having this property: 

> if the trees cross by having the same node at the same level (distance from the root), then they must overlap: for any paths `p` in the first tree and `q` in the second tree going through the crossover node `n` , there will be paths `p|n|q` and `q|n|p` that start as path `p` and switch through `n` to path `q` and vice versa.

#### data structure 2021-03-08

it's up to the user entering the links to mark the end links as terminals.  The object will not assume that all links on the last level are terminal.  maybe there could be a feature to allow the setting last_level_terminal, or some such.  

### reloading a module

```
import importlib
import itree
importlib.reloaad(itree)
```

### iterators and generators 2021-03-10

https://anandology.com/python-practice-book/iterators.html

https://www.freecodecamp.org/news/how-and-why-you-should-use-python-generators-f6fb56650888/

I decided to implement a generator.  It is started writing the generator and also started a pruning function.  much revision is still needed.

### 2021-04-14

I's been a while.  I'm looking at this again with the intention of getting an mvp going.  In iterate through the paths, it's easiest if the dead paths are pruned.  

For building the i-tree, I think what it should do is allow you to put in the links for one level, then have a function, like next(), that prunes all of the dead paths that were not continued in this level, and then goes to the next level.  

The will get built level bt level, with something like 

```
Tree.add(...links)
Tree.next()
Tree.add(...links)
Tree.next()
```

It will be iterated over when it's done being built:

```
for i in Tree:
    print(i);
```

To focus on the mvp, I'm going to forget about the terminals for now, and say that the terminals are the links at the end level since this is my use case anyway.  Also, for now I'm going to implement the class as an iterator that can only be iterated through one time.

### python3 reload:

```
from importlib import reload
```

### 2021-04-14 data structure

I switched from a list of links to a set of links.  Also, instead of combining the counts and possibly other data into one big, structure, I duplicate the structure for each type of data I want to include.  That makes it simpler and easier to extend.

```
links =
[
    ...
    {...<node>: {...prev_node}}
]

counts =
[
    ...
    {...<node>: count}
]

data =
[
    ...
    {...<node>: data}
]

```

### ordered set

for iterating it would be nice for the set of links to have an order so maybe it would be better to use a list.  Python 3 dictionaries have an order, I thought why can't sets have an order too?  I found a datatype that does this:

https://pypi.org/project/ordered-set/

I think this may be over complicted.  Instead I can duplicate the structure, and store sets and lists.