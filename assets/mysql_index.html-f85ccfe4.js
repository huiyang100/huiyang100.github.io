import{_ as a,p as e,q as d,Y as h}from"./framework-e1bed10d.js";const s="/assets/hash索引-8fd38a9a.png",p="/assets/数组索引-f6d3a954.png",i="/assets/二叉树索引-e6378a34.png",t={},n=h('<h2 id="什么是索引" tabindex="-1"><a class="header-anchor" href="#什么是索引" aria-hidden="true">#</a> 什么是索引？</h2><p>MySQL官方对索引的定义为：<code>索引（index）是帮助MySQL高效获取数据的数据结构</code>， 如果把数据表比喻成一本书，那索引就是书的目录。</p><h2 id="索引的数据结构" tabindex="-1"><a class="header-anchor" href="#索引的数据结构" aria-hidden="true">#</a> 索引的数据结构</h2><p>索引的出现是为了提高查询效率，但是实现索引的方式却有很多种，所以这里也就引入了索引模型的概念。可以用于提高读写效率的数据结构很多，比如哈希表、有序数组和搜索树。</p><h3 id="hash表" tabindex="-1"><a class="header-anchor" href="#hash表" aria-hidden="true">#</a> Hash表</h3><p>哈希表是一种以键-值（key-value）存储数据的结构，我们只要输入待查找的值即key，就可以找 到其对应的值即Value。哈希的思路很简单，把值放在数组里，用一个哈希函数把key换算成一个确定的位置，然后把value放在数组的这个位置。 不可避免地，多个key值经过哈希函数的换算，会出现同一个值的情况。处理这种情况的一种方法是拉出一个链表。</p><p>假设，你现在维护着一个用户表，需要根据用户id查询用户信息，这时对应 的哈希索引的示意图如下所示：</p><p><img src="'+s+'" alt=""></p><p>图中，id <code>20、10、122</code> 的三条数据根据hash算出来的hash位置都是4，形成了一个链表。</p><p>现在假如我们的查询条件是 id=10, 那么查找的逻辑是先根据hash算法计算出索引位置，然后遍历链表找到数据返回。</p><p>但hash结构最大的缺点是存储的数据是无序的，如果需要做区间查询 比如 <code>id&gt;10 and id&lt;100</code> ,则需要对整个hash表进行遍历。</p><p>所以，哈希表这种结构适用于只有等值查询的场景 ，比如Memcached及其他一些NoSQL。</p><h3 id="有序数组" tabindex="-1"><a class="header-anchor" href="#有序数组" aria-hidden="true">#</a> 有序数组</h3><p>有序数组在等值查询和范围查询场景中的性能就都非常优秀有。还是上面的例子，如果我们使用有序数组来实现的话，示意图如下所示：</p><p><img src="'+p+'" alt=""></p><p>这时候你要查询id=10的数据，只需要二分查找法就可以了。 并且它能很好的支持范围查询，比如要查询 <code>id&gt;10 and id&lt;100</code> 的条件，只需要二分查找id&gt;10的第一条记录，然后向右遍历直到查到第一个id&gt;=100的数据，退出循环。</p><p>如果仅仅看查询效率，有序数组就是最好的数据结构了。但是，为了维持有序性，需要在插入或者更新的时候挪动数据，成本太高。 所以，有序数组索引只适用于静态存储引擎 ，比如你要保存的是历史球队信息，这类不会再修改的数据。</p><h3 id="二叉树" tabindex="-1"><a class="header-anchor" href="#二叉树" aria-hidden="true">#</a> 二叉树</h3><p>二叉搜索树也是经典数据结构了。还是上面的例子，如果我们用二叉搜索树来实现的话，示意图如下所示：</p><p><img src="'+i+'" alt=""></p><p>二叉搜索树的特点是：每个节点的左儿子小于父节点，右儿子大于父节点。这样如果你要查 id=100 的话，按照图中的搜索顺序就是按照20 -&gt; 122 -&gt; 100 这个路径得到 这个时间复杂度是O(log(N))。 当然为了维持O(log(N))的查询复杂度，你就需要保持这棵树是平衡二叉树。为了做这个保证，更新的时间复杂度也是O(log(N))。</p><p>树可以有二叉，也可以有多叉。多叉树就是每个节点有多个儿子，儿子之间的大小保证从左到右 递增。二叉树是搜索效率最高的，但是实际上大多数的数据库存储却并不使用二叉树。其原因 是，索引不止存在内存中，还要写到磁盘上。</p><p>你可以想象一下一棵100万节点的平衡二叉树，树高20。一次查询可能需要访问20个数据块。在 机械硬盘时代，从磁盘随机读一个数据块需要10 ms左右的寻址时间。也就是说，对于一个100 万行的表，如果使用二叉树来存储，单独访问一个行可能需要20个10 ms的时间，这个查询可真 够慢的。</p><p>为了让一个查询尽量少地读磁盘，就必须让查询过程访问尽量少的数据块。那么，我们就不应该 使用二叉树，而是要使用N叉树。这里，N叉树中的N取决于数据块的大小。</p><p>以InnoDB的一个整数字段索引为例，这个N差不多是1200。这棵树高是4的时候，就可以存1200的3次方个值，这已经17亿了。考虑到树根的数据块总是在内存中的，一个10亿行的表上一 个整数字段的索引，查找一个值最多只需要访问3次磁盘。其实，树的第二层也有很大概率在内 存中，那么访问磁盘的平均次数就更少了。</p><p>N叉树由于在读写上的性能优点，以及适配磁盘的访问模式，已经被广泛应用在数据库引擎中了。</p><p>在MySQL中，索引是在存储引擎层实现的，所以并没有统一的索引标准，即不同存储引擎的索 引的工作方式并不一样。而即使多个存储引擎支持同一种类型的索引，其底层的实现也可能不 同。由于InnoDB存储引擎在MySQL数据库中使用最为广泛，所以下面我就以InnoDB为例，和 你分析一下其中的索引模型。</p><h2 id="索引的维护" tabindex="-1"><a class="header-anchor" href="#索引的维护" aria-hidden="true">#</a> 索引的维护</h2>',28),r=[n];function c(o,l){return e(),d("div",null,r)}const m=a(t,[["render",c],["__file","mysql_index.html.vue"]]);export{m as default};
