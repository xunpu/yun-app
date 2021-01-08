<template>
<view class="ksp-editor">
	<view class="body">
		<view class="content">
			<view class="node" v-for="(node, index) in nodes" :key="node.id">
				<textarea auto-focus="true" @blur="textBlur($event, index)" @input="textChange($event, node)" class="text" auto-height="true" maxlength="-1" v-if="node.type == 'text'" :cursor="node.cursor" :value="node.content"></textarea>
				<image @load="imageLoad($event, node)" class="image" :style="{width: node.width, height: node.height}" v-if="node.type == 'image'" :src="node.url"></image>
				<image @tap="deleteImage($event, node, index)" class="btn-delete" v-if="node.type == 'image'" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADsQAAA7EB9YPtSQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAA6NSURBVHic7V1rjJxVGX7eM7M721IuDRAuSaNCoNxMwU53v5nZSpebtBgxmvAHo9wMQdAoiQ1GUy6iAQmKEqIEUxSMBqKCYotc17Td75thh0SElYgY1EYhULplp7TT3Znz+oOZUMtc3rNzznfpzvNz5sw5z/m+Z95zvvM+53yEgwRBEJxKRBcz83kAlgM4EsAiS9XvAfA2gFeI6Glm/l0ul3vZUt2RgqIm0AuYmUql0me11jcR0ekhN/8SgBs9z3uEiDjktq0hsQIolUortNb3AhiJkgcRBVrrq/P5/ItR8pgvEimAUql0kdb6lwAOi5pLA7uZ+fP5fP6RqImYQkVNwBS+71+rtX4M8bn5ALCEiH4dBME1URMxRaIiQLFYvICZNwFIR82lDepE9CnP8zZHTUSKxAhgYmLiRKXU8wAOj5pLJxDRLiL62MjIyGtRc5EgMUOAUup2xPzmAwAzH6G1vi1qHlIkIgL4vj9MREUkhC8A1loXCoVCEDWRbkhEBCCi9UjOzQcASqVSX4uahASxv6i+7y8iorcAHCL8yYsAvjMwMPBMNpvdYYNDuVw+am5u7lwA3wJwhvBnu6vV6tFjY2NVGxxcIfYRgIjOg/zm/75arQ7ncrmHbN18AMhmsztyudxD1Wp1FYDHhD9bsnjx4nNtcXCF2AuAmfPCov+tVquXuvzHjY2NVev1+qXM/LqkvNZayj0yxF4ASqkThUXvGxsb2+2UDIDR0dGKUuo+YXEp98gQewForUWPfkqpSddcmmDmsqQcER3hmkuviL0AiGhQUk5r/a5rLvuhIinEzBnXRHpF7AXQh1v0BbDA0RfAAkdfAAscXdOq5XJ5cb1eP01rHdWMdqmkEBGtDIIglDQxEa1gFrnAlgZBcJ5rPq1ARNPpdPrlbDa7p2O5dl/4vr9IKfVdZr4a9syVfYSLPQB+Uq1Wv9lugaylAKampgZnZmaeALDGIbk+QgIzPzs4OHhhNpudO/C7lnOAmZmZ69C/+QcNiOicWq32pVbftZsEXuaOTh9RgJkvb/V5OwGc5JBLH9FgeasP2wnAeVKlj9Ax0+rDdgJ41iGRPqJBy3vaUgDMfCuAWDtZ+jDC3lQqdWurL1oKoLHN6RL0h4KDARVmvmR4eHiq1ZcdPYHlcvm42dnZLxJRFq0Xg0YAHCogMQngHUG5Pt7H4QBWCcpVAJRafL6XiCaVUvcNDw+/0e7HPZlCfd/fQkSrBUXPz+VyT/fS1kJDsVg8n5mf7FaOiLZ4nnf2fNvpKRmklHpbWPTIXtpZoBBdM2aW3oOW6EkAzCxy3jLzUb20sxChtZZes57cz6EIgIj6AjCE9JoRUXQC6A8BTiG9ZvEfAvoRYF4QXTPpPWiHXh1BIvVprfsRwBzxnwRqrfsRwB1E10wpFV0ESKVS0sb7AjCH6JpJ/4Tt0JOHbm5ubkc6Lapi3gKYnJw8YXZ29hil1Ou5XO6f863nQDS9jszMEu+cCUql0kdqtdqx6XT6jR5OChFds3379vUkgJ5WApmZisXiLARCYubF+Xx+r7TuUqm0Wmt9N4AVzc+I6M8Avux53rZ5EUZbr2NX75wEExMTH1dK/ahXzo0t8RJB1jzPG+zlnMKehoBGwzslZdPptDgKBEGwVmv9NPa7kADAzGcy87O+73/CjOl7mJqaGiSizcz8Vfx/bmMxgOszmcymcrk8MJ+6gyBYq5R6pg3nZ0w4a62PFhZ9u9dDKm3sCxCFoFqtJhJAuVxeDOB+AO32BA4Q0Ubf942dyt28jp28c53Q4LwR7SPhIID7pZxTqVQoj4CABQFIH0OISPRYU6vV1gI4pkux4wHMJwpc1q1AO+9cJzQ4H9upDBEdByFn6bUyWIhrX0evFUiXIg0eBUV+RCI6TVjf/jhZUOYU00qZWfQbImrpyzsQ0jxALCIAhEOAtFNaa+nEdD5Hxkm2axtv6SYiERciEvVN+meJhQBsRwAiEu3zZ2bpuUHOIeXCzNIzDJIzBECejJAubYouEhHFRgAQHmIl7ZtB+jx6AdieBCqlEicAaQSQRjfptYrFEGDbFKK1FhlR4zQESMWolJKabEPJAwAWBGBAQtop6b9kibBd52BmERfpOUbS+VKveQDAggAMSEg7lbhJoDQCGPQtlFQwYEEA9XpdSkIkgHQ6LZ0pJ04AqVRK2rdQEkGABQGMjo7uAvCBfectsKixZNoR9Xo9cQKQRiNJ31544YVDIDuQY27NmjU977WwsQ4gTghVq9Wuyp6bm0ucACDkkslkuvatUqlI3VM7bbytzNYhUaJhQCnVtXPpdFo6U47NJBBCLpVKpWvfwkwEAZYEIF0NVEp17Vwul6sCqAuqG5xv6tYmGhwkPOoSr0FYdvAmrAhAqkZJPqAR1qTGka5zCteoVCrSoUjkOAprQ0gToQrAICMomgdUq9XI5wGZTEbKwfYqYM+PgIAlATjYICKaB6TT6cgFkEqlpBykcxvRNYrVEADLCSEI/y1a68gnggYcYpcIAkIeAiBc4JAmTZRSkUcAAw5Wl4Fj9RRgOx8gTZtqrSMXQL1etyoAhJgIAiwJwPYOoSR5AqQRwEEqOFZDgIiMNMlhcLEiF4A0Ctk2g9jIBAKWBGCQlJBGAKknIPJJoFJKxIGIrD4FZDKZ+AigkZQQJYQayY6OWKgRwCQRtHLlypYHP5rC1lKwOCEkTHYkxhMgFaFEALt37xY/AtpIBAEW3xgifSyRJDuSFAFs+gGliSBYWgYGLArApj3cYMIUuQBsRgCDPICVJwDA7juDrCWEDPzziRGA0OsoXSmNXwSwaQ+XzpjjEAGkHCRu57BTwUAEQwAEKk+SM1jKQdKnMPcDNGFzCJAuBnVVeZKcwQYRoGufwk4EARE8BUjCnIF/PnIBQDgPETqCpQtl8ROAzYSQ1D6dJAEIRS3dPhe/IcDmJFBqDY/DEAChAIR9CjUPAFgUgJSUZJyTOoPjMAmE0BEs3BcoEsDAwED8BGCQnOjayT179iQpAoiMqbt27bI2BBBR/OYA2Wz2HQCzgqJD3RJCDfu0xBo+EKU1fGpqahBCS/i6dev2dSowPj6+BMCQoC5riSDA/tvDRQkhYdJDZKM2sGVbx86dO625gYaGhsRWMFuJIMC+AKwlhKSeAANbtnUMDAxYcwRLF4Fshn8gIgFAMNZJM4JROoNtOoLD3hDShG0BSI+Pl3RWJAADX7512PQDhu0GbsKqACyfGBZ7a7jUESzJbkaRCAIsC8BgOdiaK8jAlm0dUvFJBMDMkicAQDjRliKSIUCyGJSEzSHSpWhhX9q+3PEA/F1YToRIhgAIFoOS4AyWti3pi9b6cXR/X3NVa71Z0qYUkUQAWHwKiDIhZNMPWCgU3mTmDV3a21AoFN6U8pPAqgBsnhiWhO1hBuIT9SWfz9/BzOvxwUiwF8AN+Xz+DhN+ElgVgEGSwpoAoowAlucAAN4TwcDAwDJm/gKAGwBcprX+cC6Xu32+PDuhp3cGHYh6vW5NAEk4NNrBIdEAgGw2uwPAA/MiZQirEcDzvBnIEkKZRvKjLZIQAWD5kOgoYHsSKDaGdEt+SJ3BCZkESvcFhg7rAjBYDez4JGCwOSSyx0CpIcVkDhA2rAsAlvIBSTg23tUcIEy4GAKs5AOSYA23fUh0FIhyCOgoAIODlWMvAIO+hA4XQ4B0j2DHOUC9XpdOnGI/BNRqtYUzCbRlDzc4Nj72uQCDvoQO6wIwODSy4xBQq9UOmiHA4AT00BHZJLBbSlhoowaiPS9Y9CrYSqVi7c3ktmFdALaOjGvYqCVjp8nFldRnYrnuaPVuoNLNEh4lrOYCACCdTu/QWkuKSlxBkwDGBGWkiKK+krSyxmvj1wI4iYgqAP7ked5fDfgYI7JJIGQZwe8LytwpbA9KKUlZ2/V17QMAFIvFdUT0GoDfALiNme9h5qkgCB6UvGpnvrAuAJOE0LZt2w7tVCCfz/+Bmb/docjN+Xz+j1JuIyMjm4jolg5Fbsrlco+b1NeNn6Q+3/fPZuZH0fqt6Z+bm5t7iJml71Q2got1AEC+QaTrMJDP5zcw81oATxHRLgDTRPQEM1+Yy+VuMiXmed6NzfoATAOYZuYnG/XdbFpfK3771SfiR0Q/ROctZp8MguAiU26itl1UGgTBXwB8tFs5pdSqkZGRsgsOScHk5OQJtVrtH93KEdFGz/OutN1+pBFAa32io/YTg1qtdqakHDMf56J9JwIgou3Come5aD9hkF6DaReNOxEAM0u9659xNblJED4tKUREr7po3FUEeE5Y9KQgCC5wwSEJKJVKqwGcISnLzE7mSk4EUKvVAsgeBUFEd23evDnjgkecMT4+ntZa3y0sXmfmCRc8nAhgdHS0wsxPCYufsnTp0h8vtKEgk8ncBWCFsPiWfD5vdU9gE66eAkBEJrbmy4vF4j2NI1cOaoyPj6eDILiTiK6V/oaZf+GKjzMBVKvV3wL4t8FPrpmZmdkyMTGxyhWnqDExMXHm0NDQOIDrDX72FoBfOaLkZiGoCd/3rySin5r+jpmfJKJHtdZbtdb/Wb16tZNHINfYunXr0kwmc3ytVhsloosBXAjDa87M611sCWvCqQAefvjh1LJlyybRf96fL16dnp4+w2U62fnEq1gsnsbMz0N2BFof70NrrccKhcIWl404mwM00chnf8V1OwchNri++UAIEaCJYrH4PWb+eljtJRw/8zzvCpvnAbaD8wjQhOd56yE0RyxkMPOD27dvvyqMmw+EGAGa8H3/OiL6ARzY0RIOBnCL53k3h3XzgQgEAAC+7w8rpR5g5uVRtB9DvKGUumpkZGRT2A2HNgTsj3w+/5zW+iwi+gaAd6LgEBO8C+DWer1+chQ3H4goAuyPYrF4GDNfxcxXENHpUfMJA0T0N631zwHc62qNX8wlysYPRBAEpzLzOUSUY+blRPQhAIciuWsIewHsZuZ/EdErAIpa6/FCofBS1MSa+B8s+HsKrzdCkwAAAABJRU5ErkJggg=="></image>
			</view>
		</view>
	</view>
	<view class="toolbar">
		<image @tap="selectImage" class="btn-img" src="data:image/png;base64,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"></image>
		<button @tap="save" class="btn-save">保存</button>
	</view>
</view>
</template>

<script>
export default {
	props: {
		list: {
			default: null
		}
	},
	data() {
		return {
			sequence: 0,
			selection: {
				index: 0,
				cursor: 0
			},
			nodes: [],
			url: "http://ehome-totem.img-cn-shenzhen.aliyuncs.com/1912021526894820202354639.png"
		};
	},
	mounted() {
		this.initNodes();
	},
	methods: {
		obtainSequence() {
			this.sequence++;
			return this.sequence;
		},
		initNodes() {
			var list = this.list || [];
			if (Object.prototype.toString.call(list) != "[object Array]") {
				throw new Error("数据格式不正确！")
			}
			var nodes = [];
			for(var i = 0; i < list.length; i++) {
				var ele = list[i];
				if (ele.type == "text") {
					var node = {};
					node.type = "text";
					node.id = this.obtainSequence();
					node.content = ele.content || "";
					nodes.push(node);
				} else if (ele.type == "image") {
					var node = {};
					node.type = "image";
					node.id = this.obtainSequence();
					node.width = "100px";
					node.height = "100px";
					node.url = ele.url || "";
					nodes.push(node);
				}
			}
			this.nodes = nodes;
			this.trimNodes();
		},
		trimNodes() {
			var list = this.nodes;
			var nodes = [];
			var temp = null;
			for(var i = 0; i < list.length; i++) {
				var node = list[i];
				if (node.type == "image") {
					nodes.push(node);
					temp = null;
					continue;
				}
				if (!temp) {
					temp = node;
					nodes.push(temp);
					continue;
				}
				if (node.type == "text") {
					temp.content += node.content;
				}
			}
			if (nodes.length == 0 || nodes[nodes.length - 1].type != "text") {
				var node = {};
				node.id = this.obtainSequence();
				node.type = "text";
				node.content = "";
				nodes.push(node);
			}
			this.nodes = nodes;
		},
		imageLoad(ev, node) {
			var query = uni.createSelectorQuery().in(this);
			query.select(".content").boundingClientRect((data) => {
				var cw = data.width;
				var iw = ev.detail.width;
				var ih = ev.detail.height;
				node.width = cw + "px";
				node.height = ih / iw * cw + "px";
			}).exec();
		},
		textChange(ev, node) {
			node.content = ev.detail.value;
			setTimeout(() => {
				node.cursor = 1;
			}, 500)
		},
		textBlur(ev, index) {
			this.selection.index = index;
			this.selection.cursor = ev.detail.cursor;
		},
		selectImage() {
			this.$emit("selectImage");
		},
		addImage(url) {
			var index = this.selection.index;
			var cursor = this.selection.cursor;
			var snode = this.nodes[index];
			var content = snode.content;
			if (cursor == 0) {
			} else if (cursor < content.length) {
				snode.content = content.substring(0, cursor);
				var node = {};
				node.id = this.obtainSequence();
				node.type = "text";
				node.content = content.substring(cursor);
				this.nodes.splice(index + 1, 0, node);
				index++;
			} else {
				index++;
			}
			var node = {};
			node.id = this.obtainSequence();
			node.type = "image";
			node.url = url;
			node.width = "100px";
			node.height = "100px";
			this.nodes.splice(index, 0, node);
			this.trimNodes();
		},
		deleteImage(ev, node, index) {
			uni.showModal({
				content: '你确定删除吗？',
				success: (res) => {
					if (!res.confirm) {
						return;
					}
					this.nodes.splice(index, 1);
					if (this.selection.index > index) {
						this.selection.index--;
					}
					this.trimNodes();
					var url = node.url;
					this.$emit("deleteImage", {url: url});
				}
			});
		},
		save() {
			var result = [];
			for(var i = 0; i < this.nodes.length; i++) {
				var node = this.nodes[i];
				var ele = {};
				ele.type = node.type;
				if (node.type == "text") {
					ele.content = node.content;
				} else if (node.type == "image") {
					ele.url = node.url;
				}
				result.push(ele);
			}
			this.$emit("save", {result: result});
		}
	},
	watch: {
		"list": function() {
			this.initNodes();
		}
	}
}
</script>

<style>
.ksp-editor {
	position: absolute;
	width: 100%;
	height: 100%;
	left: 0upx;
	top: 0upx;
}
.toolbar {
	position: absolute;
	width: 100%;
	height: 100upx;
	left: 0upx;
	bottom: 0upx;
	box-sizing: border-box;
	border-top: 1px solid #C0C0C0;
	background: #F8F8F8;
}
.btn-img {
	position: absolute;
	width: 60upx;
	height: 60upx;
	left: 60upx;
	top: 20upx;
}
.btn-save {
	position: absolute;
	right: 30upx;
	top: 15upx;
	font-size: 30upx;
	line-height: 30upx;
	padding: 20upx;
	color: #333333;
}
.body {
	position: absolute;
	left: 0upx;
	right: 0upx;
	top: 0upx;
	bottom: 100upx;
	background: white;
}
.content {
	position: absolute;
	left: 20upx;
	right: 20upx;
	top: 20upx;
	bottom: 20upx;
	overflow-y: auto;
}
.node {
	position: relative;
	overflow: hidden;
}
.text {
	width: 100%;
	font-size: 36upx;
}
.btn-delete {
	position: absolute;
	width: 60upx;
	height: 60upx;
	right: 30upx;
	bottom: 30upx;
}
</style>
