from itree import ITree

def test():
    Tree = ITree()
    print(Tree.len())
    Tree.start([0,1])
    print(Tree.len())
    Tree.add([(1,2)])
    Tree.add([(1,3)])
    print(Tree.len())
    print(Tree.counts)
    print(Tree.links)
    Tree.next()
    Tree.add([(3,4), (3,5),(2,5)])
    print(Tree.len())
    print(Tree.counts)
    print(Tree.links)