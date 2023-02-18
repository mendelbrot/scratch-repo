class ITree:
    def __init__(self):
        self.links = [{}]
        self.counts = [{}]
    
    def __iter__(self):
        return ITree_iter(link_lists)

    # input: a list of nodes
    # starts the itree and then starts a new level
    def start(self, nodes):
        for node in nodes:
            self.links[0][node] = None
            self.counts[0][node] = 1
        
        # start next level
        self.links.append({})
        self.counts.append({})

    # input:
    # a list, each element is a tuple: a previous_node - node link.
    # [...(prev_node, node)]
    def add(self, new_links):
        links = self.links[-1]
        prev_counts = self.counts[-2]
        counts = self.counts[-1]
        for n1, n in new_links:
            k1 = prev_counts[n1]
            try:
                links[n] |= set([n1])
                counts[n] += k1
            except:
                links[n] = set([n1])
                counts[n] = k1
    
    # prune and start the next level.
    def next(self):
        # prune
        level = len(self.links) - 1
        while level > 0:
            nodes_that_continued = set().union(*self.links[level].values())
            prev_links = self.links[level - 1]
            prev_counts = self.counts[level - 1]
            nodes_to_prune = set(prev_links) - nodes_that_continued
            if not nodes_to_prune:
                break
            for n in nodes_to_prune:
                del prev_links[n]
                del prev_counts[n]
            level -= 1
        
        # start next level
        self.links.append({})
        self.counts.append({})
    
    # returns the total number of paths in the itree
    def len(self):
        return sum(self.counts[-1].values())
    
class ITree_iter:
    def __init__(self, links):

        # convert the dictionaries and sets into lists for iteration
        self.node_lists = [[]]
        self.link_lists = [[]]

        for node in links[0].keys():
            self.node_lists[0].append(node)
            self.link_lists[0].append(None)

        for level in links[1:]:
            next_node_list = []
            next_link_list =[]
            
            for node, links in level.items():
                next_node_list.append(node)
                next_link_list.append(links)

            self.node_lists.append(next_node_list)
            self.link_lists.append(next_link_list)

        # path stores the path we are currently on
        # cursor keeps track of what (level, node) was changed last
        self.path = [node_list[0] for node_list in node_lists]
        self.cursor = (0,0)

    def __iter__(self):
        return self

    def __next__(self):
        raise StopIteration()