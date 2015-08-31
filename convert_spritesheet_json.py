import json 
import sys

def convert(input, output):

	with open(input) as f:
		data = f.read()
	
	spritesheet = json.loads(data)
	
	out_json = {
	'name': input[:-5], 
	'cells': []}
	
	for sprite in spritesheet['frames']:
		x = sprite['frame']['x']
		y = sprite['frame']['y']
		w = sprite['frame']['w']
		h = sprite['frame']['h']						
		sprite_json = {'x': x, 'y': y, 'w': w, 'h': h}
		out_json['cells'].append(sprite_json)
	
	with open(output, 'w') as f:
		f.write(json.dumps(out_json)) 
	


if __name__ == '__main__':
	input = sys.argv[1]
	output = sys.argv[1]
	convert(input, output)