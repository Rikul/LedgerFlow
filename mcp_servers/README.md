# MCP Servers

This directory contains standalone Model Context Protocol (MCP) servers that extend LedgerFlow with additional tooling.

## yfinance server

The `yfinance_server.py` script exposes tools for fetching equity pricing data via [yfinance](https://pypi.org/project/yfinance/). It supports two primary use cases:

- Retrieve OHLCV data for a specific calendar date.
- Retrieve the most recent N trading days of OHLCV data.

### Installation

```
pip install -r requirements.txt
```

### Usage

The server communicates over stdio. You can launch it manually for testing:

```
python yfinance_server.py
```

Refer to the MCP documentation for how to register the server with an MCP-compatible client.
