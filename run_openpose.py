import sys
import json
import subprocess
import os

def run_openpose(input_path):
    # Path ke OpenPose binary (ubah sesuai environment Anda)
    openpose_bin = "openpose"
    output_dir = "./openpose_output"
    os.makedirs(output_dir, exist_ok=True)

    # Jalankan OpenPose CLI
    cmd = [
        openpose_bin,
        "--image_path", input_path,
        "--write_json", output_dir,
        "--display", "0",
        "--render_pose", "0"
    ]
    subprocess.run(cmd, check=True)

    # Ambil file JSON hasil output
    json_files = [f for f in os.listdir(output_dir) if f.endswith('.json')]
    if not json_files:
        print(json.dumps({"error": "No output from OpenPose"}))
        sys.exit(1)
    result_path = os.path.join(output_dir, json_files[0])
    with open(result_path, 'r') as f:
        data = json.load(f)
    print(json.dumps(data))
    # Bersihkan output
    os.remove(result_path)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input file"}))
        sys.exit(1)
    run_openpose(sys.argv[1]) 