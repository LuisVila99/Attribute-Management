import base64
import sys

# The base64-encoded proof string from your data
base64_proof = "eJylks1qFEEUhZ9opuvWrd9eDTGgCAlE3diboX6nG4buprrz43IU3EefQDOSScCFkFUWvse8jdWOqPss61443znn1sfdwnXtGK7Gn/U49kNZFJfY+HmXVoWrTdP2XdOOxQXf2WRaV4fh+sO3tbFhfW9WqxRWZuzSTdcPnzZf1vuF4oxLpVm0MvjAtTdWA9PEGRMBAlhtfbQ6ghdRGS8xaEs5B+5QT+PN166/HWozo1z8I74/EH84s15Ooy4tD7sJ/HkCn/r89iUyIlGJkmWekjxSdFSSoFCic8pbBwapj9kidSiEhRilyw6oiEAYz0aYhkD0/zY2twdkDn73B974/YKQvJOGBI48Z4mRM2TRI0HnY2Au63grPGrkKECDzlid9a2gwJgT2/FdH25you15aobrvZvqz+2DmlNK5ghzQFXkfWi9ScVTcYU3o9nWZqiffqTvk8wyBReai+AfKKE4AzID9QZUSXQJWO361HUxF/VI4MUxVCfHz6sj8vKMvnpbnWIlX59VR78buH/295P9Aies2Zg="

# Decode the base64 string and calculate the byte size
decoded_proof = base64.b64decode(base64_proof)
size_in_bytes = len(decoded_proof)

# Print the size in bytes
print(f"Size in bytes: {size_in_bytes} bytes")

# Convert bytes to other units for more readability
size_in_kb = size_in_bytes / 1024
size_in_mb = size_in_kb / 1024
size_in_gb = size_in_mb / 1024

print(f"Size in KB: {size_in_kb} KB")
print(f"Size in MB: {size_in_mb} MB")
print(f"Size in GB: {size_in_gb} GB")
